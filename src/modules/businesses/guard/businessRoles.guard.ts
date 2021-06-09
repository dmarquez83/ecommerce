import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { BusinessPermission } from '../../../common/enum/businessPermission.enum';
import { TeammatePermission } from '../../../common/enum/teammatePermission.enum';
import { Permissions, RolePermissions } from '../../../models';
import { UserRole } from '../../../models/userRole.entity';

@Injectable()
export class BusinessRolesGuard implements CanActivate {

    constructor(
            @Inject('UserBusinessRolesService') private readonly UserBusinessRolesService,
            private reflector: Reflector,
            @InjectRepository(RolePermissions)
        private readonly rolePermissionsRepository: Repository<RolePermissions>,
            @InjectRepository(Permissions)
        private readonly permissionsRepository: Repository<Permissions>,
            @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>) {}

    canActivate(context: ExecutionContext, ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) { return true; }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const idUser = user.userId as number;
        const idBusiness = request.params.id;

        if (roles[0] === TeammatePermission.LIST && request.params.idUser) {
            roles[0] = BusinessPermission.LIST;
        }

        const option = {id: request.params.id, type: 'Business'};

        let result;

        if (idBusiness) {
            result = this.UserBusinessRolesService.checkPermissions(idUser, option, roles);
        } else {
            result = this.checkPermissionWithoutId(idUser, roles);
        }

        if (!result) {
            throw new ForbiddenException({
                code: 403,
                status: false,
                message: 'You do not have the necessary permissions to perform this action.'
            });
        }

        return result;
    }

    /**
     * Check permissions over action that doesn't require an
     * business id, like create or list all
     *  
     * @param idUser User id who is going to do the action
     * @param roles roles of required by the endpoint
     */
    async checkPermissionWithoutId(idUser: number, roles: string[]): Promise<boolean> {
        const permission = await this.permissionsRepository.findOne({where: [{code: roles[0]}]});
        
        if (!permission) { return false; }

        const userRole = await this.userRoleRepository.findOne({where: [{idUser}]});
        if (!userRole) { return false; }
        const [, count] = await this.rolePermissionsRepository.findAndCount({where: [{idPermission: permission.id, idRole: userRole.idRole}]});
        
        return (count > 0) ? true : false;
    }
}
