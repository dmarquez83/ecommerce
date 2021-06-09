import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { rolesResponses } from '../../common/responses/roles.response';
import { BasicService } from '../../common/services/base.service';
import { Role } from '../../models/role.entity';
import { UserBusinessRolesService } from '../userBusinessRoles/userBusinessRoles.service';
import { IUserReq } from '../users/interfaces/userReq.interface';

@Injectable()
export class RolesService extends BasicService<Role> {

    listResponse = rolesResponses.list;

    constructor(
            @InjectRepository(Role)
            private readonly roleRepository: Repository<Role>,
            private readonly userBusinessRolesService: UserBusinessRolesService
        ) {
        super(roleRepository);
    }
   
    /**
     * Find a Role by its type
     * @param type role's type
     */
    async findByType(type: string) {

        const roles = await this.roleRepository.createQueryBuilder('R')
                .innerJoinAndSelect('R.permissions', 'P')
                .andWhere('R.type = :type', {type})
                .andWhere('P.status = :status', {status: Status.ENABLED})
                .orderBy('P.type', 'ASC')
                .addOrderBy('P.name', 'ASC')
                .getMany();

        return this.formatReturn(this.listResponse.success, 'roles', roles);
    }

    async inviteTeammate(roles: any, idBusiness: number, idUser: number, user: IUserReq, response: any) {
        
        const userRoleDB = await this.userBusinessRolesService.find({where: {idUser, idBusiness, disabled: false}});

        if ( userRoleDB.length > 0) {
            throw new NotAcceptableException(response.userIsTeammate);
        }

        await this.assignUserBusinessRoles(roles, idBusiness, idUser, user, response.error);
    }

    async assignUserBusinessRoles(roles: any, idBusiness: number, idUser: number, user: IUserReq, error: any) {
        for (const rol of roles) {

            const userRoleDB = await this.userBusinessRolesService.findOneWithOptions({
                where: [{idRole: rol.id, idUser, idBusiness}]
            }).catch(() => {
                throw new InternalServerErrorException(error);
            });
    
            if (userRoleDB) {
                if (rol.assigned) {
                    await this.userBusinessRolesService.activate(userRoleDB, user, error);
                } else {
                    await this.userBusinessRolesService.disable(userRoleDB, user, error);
                }
            } else {
                const ubr =  {
                    idUser,
                    idBusiness,
                    idRole: rol.id,
                    disabled: false,
                    creationUser: user.userId,
                };
                await this.userBusinessRolesService.create(ubr, user)
                    .catch(() => {
                        throw new InternalServerErrorException(error);
                    });
            }
        }
    }

    /**
     * Set a user as a Business Administrator when creating an business
     * 
     * @param user logged user extracted from token
     * @param business business object to wich the user is going to be set as administrator
     */
    async setAdminUserRolesBusiness(user: IUserReq, business: any, error: any) {

        const rol = await this.findOneOrFailByNameAndType( 'Administrator', 'Businesses');

        const ubr =  {
            idUser: user.userId,
            idBusiness: business.id,
            idRole: rol.id,
            creationDate: new Date(),
            creationUser: user.userId,
            disabled: false,
            rol,
            business,
            user: null,
            modificationUser: null,
            modificationDate: null,
        };

        await this.userBusinessRolesService.create(ubr, user)
            .catch(() => {
                throw new InternalServerErrorException(error);
            });

        return;
    }

    /**
     *  Disable rol for a user in the business
     * 
     * @param idBusiness id of the business
     * @param idUser Id the user to deactivate the permission
     * @param idRole Id rol to disable
     * @param user Current user
     */
    async disableUserBusinessRole(idBusiness: number, idUser: number, user: IUserReq, error: any) {
        
        const userBusinessRole = await this.userBusinessRolesService.findWithOptionsOrFail({
            where: [{idBusiness, idUser}]
        })
        .catch(() => {
            throw new NotFoundException(error);
        });
        
        await this.userBusinessRolesService.disable(userBusinessRole, user, error);
    }

    /**
     * Find a Role by its type and name
     * @param name role's name
     * @param type role's type
     */
    async findOneOrFailByNameAndType(name: string, type: string): Promise<Role> {
        
        return await this.roleRepository.findOneOrFail({ where: [{ name, type, status: Status.ENABLED}] })
            .catch(() => {
                throw new NotAcceptableException(this.listResponse.notFound);
            });
    }
}
