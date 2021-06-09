import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userResponses } from '../../common/responses/users.response';
import { BasicService } from '../../common/services';
import { UserRole } from '../../models';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UserRolesService extends BasicService<UserRole> {

    constructor(
        @InjectRepository(UserRole)
        private readonly userRolesRepository: Repository<UserRole>,
        private readonly rolesService: RolesService
    ) {
        super(userRolesRepository);
    }

    /**
     * Assign the seller role to the user
     * 
     * @param user: user which the seller role is about to be assigned 
     */
    async setSellerRole(user) {
        const sellerRole = await this.rolesService
                                    .findOneWithOptionsOrFail({where: {name: 'Seller'}});
        
        const userRole = {
            idUser: user.id,
            idRole: sellerRole.id,
            creationDate: new Date(),
            creationUser: +user.id
        }; 

        await this.save(userRole, { userId: user.id, username: user.username })
            .catch(() => {
                throw new InternalServerErrorException(userResponses.creation.cantAssignRole);
            });
    }

}
