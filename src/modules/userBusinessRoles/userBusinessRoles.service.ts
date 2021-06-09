import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { BasicService } from '../../common/services/base.service';
import { Permissions, RolePermissions, UserBusinessRole, UserRole } from '../../models';
import { IUserReq } from '../users/interfaces/userReq.interface';

@Injectable()
export class UserBusinessRolesService extends BasicService<UserBusinessRole> {

    constructor(
        @InjectRepository(UserBusinessRole)
        private readonly UserBusinessRolesService: Repository<UserBusinessRole>,
        @InjectRepository(Permissions)
        private readonly permissionsRepository: Repository<Permissions>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
        @InjectRepository(RolePermissions)
        private readonly rolePermissionsRepository: Repository<RolePermissions>

    ) {
        super(UserBusinessRolesService);
    }

    /**
     * Check permission of an action to a user in an business
     * 
     * @param idUser User id who is going to do the action 
     * @param option Option to check if a user can perform a certain action in an business
     * @param roles roles required by the endpoint
     */
    async checkPermissions(idUser: number, option: any, roles: string[]): Promise<boolean> {
        const permission = await this.permissionsRepository.findOne({ where: [{ code: roles[0] }] });
        const idRoles = [];

        let query = this.UserBusinessRolesService.createQueryBuilder('UBR')
            .innerJoinAndSelect('UBR.business', 'S');

        switch (option.type) {
            case 'Location':
                query = query
                    .innerJoinAndSelect('S.locations', 'L')
                    .where('L.id = :id ', { id: option.id })
                    .andWhere('L.status != :status', { status: Status.DELETED });
                break;
            case 'Business':
                query = query.where('S.id = :id ', { id: option.id });
                break;
            case 'Product':
                query = query
                    .innerJoinAndSelect('S.products', 'P', 'P.idBusiness = S.id')
                    .where('P.id = :id ', { id: option.id });
                break;
            case 'Variation':
                query = query
                    .innerJoinAndSelect('S.products', 'P', 'P.idBusiness = S.id')
                    .innerJoinAndSelect('P.productVariations', 'PV', 'PV.idProduct = P.id')
                    .where('PV.id = :id ', { id: option.id });
                break;
            default:
                return false;
        }

        const permissionsUser = await query
            .select('UBR.idRole')
            .andWhere('UBR.idUser = :idUser', { idUser })
            .andWhere('NOT UBR.disabled')
            .andWhere('S.status != :status', { status: Status.DELETED })
            .getMany();

        this.fillRoles(idRoles, permissionsUser);
        const userRole = await this.userRoleRepository.find({ where: [{ idUser, status: Status.ENABLED }] });
        this.fillRoles(idRoles, userRole);

        const queryPermissions = `
            select id_permission
            from get_roles_permissions(array[${idRoles}])
            where id_permission = ${permission.id}`;
        const resultPermission = await this.manager.query(queryPermissions);

        return (resultPermission.length > 0);
    }

    fillRoles(roles: any[], userRoles: any) {
        for (const x of userRoles) {
            roles.push(x.idRole);
        }
    }

    async create(data: any, user: IUserReq) {
        return await this.save(data, user);
    }

    /**
     * Update User Business Role
     * 
     */
    async update(data: any, entity: UserBusinessRole, user: IUserReq) {
        return await this.updateEntity(data, entity, user);
    }

    /**
     * Disable User Business Role
     * @param entity User Business Role
     * @param user Logged User
     * @param response Response with the structure to return
     */
    async disable(entity: UserBusinessRole | UserBusinessRole[], user: IUserReq,
                  response: any) {
        await this.disableEntity(entity, user)
            .catch(() => {
                throw new InternalServerErrorException(response);
            });
    }

    /**
     * Activate User Business Role
     * @param entity User Business Role
     * @param user Logged User
     * @param response Response with the structure to return
     */
    async activate(entity: UserBusinessRole, user: IUserReq, response: any) {
        await this.activateEntity(entity, user)
            .catch(() => {
                throw new InternalServerErrorException(response);
            });
    }
}
