import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { spStatus } from '../../../common/enum/serviceProposalStatus.enum';
import { tsPermission } from '../../../common/enum/transportServicePermission.enum';
import { ServiceProposal, TransportService } from '../../../models';

@Injectable()
export class TransportServicesGuard implements CanActivate {
    
    private userPermissions = [
                                tsPermission.UPDATE, 
                                tsPermission.CANCEL, 
                                tsPermission.cPICKED, 
                                tsPermission.COMPLETE, 
                                tsPermission.DELETE
                            ];
    private driverPermissions = [
                                tsPermission.PICKUP, 
                                tsPermission.DELIVERY
                            ];

    constructor(
        @InjectRepository(TransportService)
        private readonly tsRepository: Repository<TransportService>,
        @InjectRepository(ServiceProposal)
        private readonly spRepository: Repository<ServiceProposal>,
        private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissions = this.reflector.get<string[]>('roles', context.getHandler());
        if (!permissions) { return true; }

        const response = (this.reflector.get<string[]>('response', context.getHandler()))[0];

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const idUser: number = +user.userId;
        const idService: number = +request.params.id || null;

        const ts = await this.tsRepository.findOne({
            where: {id: idService, creationUser: idUser}
        }).catch(() => {
            throw new ForbiddenException(response['noPermission']);
        });

        if (ts) {
            // validate permissions for user (creator of the service)
            this.validatePermissions(permissions, this.userPermissions, response);
        } else {

            // verify if user is the driver of the service
            await this.spRepository.findOneOrFail({
                where: {idService, creationUser: idUser, status: spStatus.ACCEPTED}
            }).catch(() => {
                throw new ForbiddenException(response['noPermission']);
            });

            // validate permissions for driver
            this.validatePermissions(permissions, this.driverPermissions, response);
        }

        return true;
    }

    /**
     * Validate Request Permissions
     * @param permissionsToVerify necessary permissions to perform request action
     * @param permissions 
     * @param response response in case os error
     */
    private validatePermissions(permissionsToVerify: string[], permissions: string[], response: {}) {
        const commons = permissionsToVerify.filter(value => permissions.includes(value));

        if (!commons || commons.length === 0) {
            throw new ForbiddenException(response['noPermission']);
        }
    }
}
