import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportService } from '../../../models';

@Injectable()
export class ServiceProposalsGuard implements CanActivate {
    private driverPermissions = ['Cancel', 'Create', 'Delete', 'DriverList'];
    private userPermissions = ['Decline', 'Accept', 'UserList'];

    constructor(
        @InjectRepository(TransportService)
        private readonly tsRepository: Repository<TransportService>,
        private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissions = this.reflector.get<string[]>('roles', context.getHandler());
        if (!permissions) { return true; }

        const response = this.reflector.get<string[]>('response', context.getHandler());

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const idUser: number = +user.userId;
        const idService: number = +request.params.idService || +request.body.idService || null;
        const idDriver: number = +request.params.idDriver || null;
        
        const ts = await this.tsRepository.findOne({
            relations: ['creationUser'],
            where: {id: idService}
        }).catch(() => {
            throw new ForbiddenException(response[0]['noPermission']);
        });

        const idServiceCreator: number = ts ? +ts['creationUser']['id'] : null;

        if (idUser === idServiceCreator) {
            this.validateUser(idUser, idDriver, permissions, response[0]);
        } else if ( permissions[0] === 'Create') {
            return true;
        } else if ( idUser === idDriver || (!idDriver && !idService) ) {
            this.validateDriver(permissions, response[0]);
        } else {
            throw new ForbiddenException(response[0]['noPermission']);
        }

        return true;
    }

    /**
     * Validate Service Creator Permission
     * @param idUser Service Creator id
     * @param idDriver Driver id (proposal creator)
     * @param permissions necessary permissions to perform request action
     * @param response response in case os error
     */
    validateUser(idUser: number, idDriver: number, permissions: string[], response: {}) {
        if (idUser === idDriver) {
            throw new ForbiddenException(response['noPermission']);
        } 

        this.validatePermissions(permissions, this.userPermissions, response);
    }

    /**
     * Validate Driver Permission
     * @param permissions necessary permissions to perform request action
     * @param response response in case os error
     */
    validateDriver(permissions: string[], response: {}) {
        this.validatePermissions(permissions, this.driverPermissions, response);
    }

    /**
     * Validate Request Permissions
     * @param permissionsToVerify necessary permissions to perform request action
     * @param permissions 
     * @param response response in case os error
     */
    validatePermissions(permissionsToVerify: string[], permissions: string[], response: {}) {
        const commons = permissionsToVerify.filter(value => permissions.includes(value));

        if (!commons || commons.length === 0) {
            throw new ForbiddenException(response['noPermission']);
        }
    }
}
