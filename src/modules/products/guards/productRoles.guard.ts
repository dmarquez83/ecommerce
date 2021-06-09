import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProductPermission } from '../../../common/enum/productPermission.enum';

@Injectable()
export class ProductsRolesGuard implements CanActivate {

    constructor(
        @Inject('UserBusinessRolesService') private readonly UserBusinessRolesService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) { return true; }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const idUser = user.userId as number;

        let option = null;
        if (roles[0] === ProductPermission.CREATE) {
            option = {id: request.body.idBusiness, type: 'Business'};
        } else if (roles[0] === ProductPermission.STOCK) { 
            let isVariant = false;

            if (typeof request.body.isVariant === 'string') {
                isVariant = request.body.isVariant === 'true';
            } else {
                isVariant = request.body.isVariant;
            }

            if ( isVariant ) {
                option = {id: request.params.id, type: 'Variation'};
            } else {
                option = {id: request.params.id, type: 'Product'};
            }
        } else if (roles[0] === ProductPermission.LIST &&
            request.url.includes('business')
        ) {
            option = {id: request.params.id, type: 'Business'};
        } else {
            option = {id: request.params.id, type: 'Product'};
        }

        const result = await this.UserBusinessRolesService.checkPermissions(idUser, option, roles);

        if (!result) {
            throw new ForbiddenException({
                code: 403,
                status: false,
                message: 'You do not have the necessary permissions to perform this action.'
            });
        }

        return result;
    }
}
