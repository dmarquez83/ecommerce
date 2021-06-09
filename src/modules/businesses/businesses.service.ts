import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Status } from '../../common/enum/status.enum';
import { IPaginationOptions } from '../../common/interfaces';
import { businessResponses } from '../../common/responses/business.response';
import { locationResponses } from '../../common/responses/locations.response';
import { productResponses } from '../../common/responses/product.response';
import { userResponses } from '../../common/responses/users.response';
import { BasicService } from '../../common/services/base.service';
import { User } from '../../models';
import { Business } from '../../models/business.entity';
import { FilesService } from '../files/files.service';
import { LocationsService } from '../locations/locations.service';
import { OffersService } from '../offers/offers.service';
import { ProductsService } from '../products/products.service';
import { RolesService } from '../roles/roles.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { WalletService } from '../wallet/wallet.service';
import { AssignRoleDto } from './dto/assignRoleBusiness.dto';
import { CreateBusinessDto } from './dto/createBusiness.dto';
import { InviteTeammateDTO } from './dto/inviteTeammate.dto';
import { UpdateBusinessDto } from './dto/updateBusiness.dto';

@Injectable()
export class BusinessesService extends BasicService<Business> {

    private relations = ['legalRepresentativeEntity', 'image', 'locations'];

    constructor(@InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
                private readonly walletService: WalletService,
                @Inject('FilesService') private readonly filesService: FilesService,
                private readonly rolesService: RolesService,
                private readonly productsService: ProductsService,
                private readonly locationsService: LocationsService,
                private readonly offersService: OffersService,
    ) {
        super(businessRepository);
    }

    /**
     * Activate a business
     * @param id business id that is going to be activated
     * @param user User who executes the action
     * @param response Response standards used in this method
     */
    async activate(id: number, user: IUserReq, response: any) {
        const businessDB = await this.findByIdWithRelationsOrFail(id, response.noPermission, this.relations);

        const businessUpdated = await this.activateEntityByStatus(businessDB, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
        
        this.mapBusinessReturn(businessUpdated);

        return this.formatReturn(response.success, 'business', businessUpdated);
    }

    /**
     * Responsible for assigning the role in a company to a user
     * 
     * @param data Business, user, and rol to assign.
     * @param user logged user extracted from token
     */
    @Transactional()
    async assignRol(id: number, idUser: number, data: AssignRoleDto, user: IUserReq, response: any) {

        this.validateRolesArray(data.roles, response);
        await this.rolesService.assignUserBusinessRoles(   data.roles, 
                                                        id,
                                                        idUser,
                                                        user, 
                                                        response.error);

        return response.success;
    }

    /**
     * Create an business
     * @param body: data required to create an business (name, wallet, description, ...) 
     * @param user User performing the action.
     * @param response Response standards used in this method
     */
    @Transactional()
    async create(body: CreateBusinessDto, user: IUserReq, response: any) {

        if (!body.personal) {
            await this.existsName(body.name, response.nameBeUnique);
        }
        
        body.legalRepresentative = user.userId;
        body.idWallet = (await this.walletService.createWallet(user.userId)).id;

        if (body.imgCode) {
            await this.filesService.findByNameOrFail(body.imgCode);
        } else {
            const imagesAssigned = await this.getBusinessesImagesByUserWithPermission(user.userId);
            body.imgCode = this.getRandomAvatar(imagesAssigned);
        }

        const business = await this.saveAndGetRelations(body, user, this.relations)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
        
        await this.setAdminUserRolesBusiness(user, business);

        this.mapBusinessReturn(business);
        
        return this.formatReturn(response.success, 'business', business);
    }

    /**
     * Delete a business
     * 
     * @param id business id that is going to be disabled
     * @param user User who executes the action
     * @param response Response standards used in this method
     */
    @Transactional()
    async delete(id: number, user: IUserReq, response: any) {
        const business = await this.findByIdWithRelationsOrFail(id, response.noPermission,
            ['offers', 'locations', 'products', 'legalRepresentativeEntity', 'image']);

        const businessDeleted = await this.deleteEntityByStatus(business, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
        
        await this.deleteAllAssociatedWithTheBusiness(businessDeleted, user);

        this.mapBusinessReturn(businessDeleted);
        
        return this.formatReturn(response.success, 'business', businessDeleted);
    }

    /**
     * Disable a business
     * 
     * @param id business id that is going to be deleted
     * @param user User who executes the action
     * @param response Response standards used in this method
     */
    async disable(id: number, user: IUserReq, response: any) {
        const business = await this.findByIdWithRelationsOrFail(id, response.noPermission, this.relations);

        const businessDisabled = await this.disableEntityByStatus(business, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
            
        this.mapBusinessReturn(businessDisabled);
        
        return this.formatReturn(response.success, 'business', businessDisabled);
    }

    /**
     *  Disable rol for a user in the business
     * 
     * @param idBusiness id of the business
     * @param idUser Id the user to deactivate the permission
     * @param idRole Id rol to disable
     * @param user Current user
     */
    async disablePermission(idBusiness: number, idUser: number, user: IUserReq, response: any) {
        
        await this.rolesService.disableUserBusinessRole(idBusiness, idUser, user, response.error);
         
        return response.success;   
    }

    /**
     * Finds a business with id specified
     * @param id: id of the business to seek 
     * @param response Response standards used in this method
     */
    async findById(id: number, response: any) {
        const business = await this.findByIdWithRelationsOrFail(id, response.error, this.relations);

        this.mapBusinessReturn(business);

        return this.formatReturn(response.success, 'business', business);
    }

    /**
     * Find roles and permissions of the specified user in the business specified
     * 
     * @param idBusiness business id to be consulted
     * @param idUser user id to be consulted
     */
    async findTeammateByBusinessAndId(idBusiness: number, idUser: number, response: any) {
        const permissions = await getRepository(User).createQueryBuilder('U')
                            .innerJoinAndSelect('U.userBusinessRoles', 'UBR')
                            .innerJoinAndSelect('UBR.rol', 'R')
                            .leftJoinAndSelect('R.permissions', 'P', 'P.status = :status', {status: Status.ENABLED})
                            .andWhere('U.id = :idUser', {idUser})
                            .andWhere('UBR.idBusiness = :idBusiness', {idBusiness})
                            .andWhere('not UBR.disabled')
                            .orderBy('P.type', 'ASC')
                            .addOrderBy('P.name', 'ASC')
                            .getOne();

        return this.formatReturn(response.success, 'user', this.userBusinessRoleMap(permissions));
    }

    /**
     * Find users with active roles in business with id specified
     * 
     * @param idBusiness business id to consult active user roles
     */
    async findTeammates(idBusiness: number, options: IPaginationOptions, response: any): Promise<any> {
        const permissions = await getRepository(User).createQueryBuilder('U')
                        .innerJoinAndSelect('U.userBusinessRoles', 'UBR')
                        .innerJoinAndSelect('UBR.rol', 'R')
                        .andWhere('UBR.idBusiness = :idBusiness', {idBusiness})
                        .andWhere('not UBR.disabled')
                        .getMany();

        const result = [];
        permissions.forEach(element => {
            result.push(this.userBusinessRoleMap(element));
        });
        
        return this.formatReturn(response.success, 'result', await this.paginate(options, result));
    }

    /**
     * Find all the images of the businesses to which a user has access
     * @param idUser id of user
     */
    async getBusinessesImagesByUserWithPermission(idUser: number): Promise<string[]> {
        const businesses = await this.findBusinessesByUserWithPermission(idUser);
        return businesses.map((element) => {
            if (element['image']) {
                return element.image.name;
            }

            return null;
        });
    }


    /**
     * List all businesses
     * @param user User who executes the action
     * @param response Response standards used in this method
     */
    async index(user: IUserReq, response: any): Promise<any> {
        const businessesBD = await this.findBusinessesByUserWithPermission(+user.userId);
        
        if (!businessesBD) {
            throw new InternalServerErrorException(response.error);
        }
        const businesses = [];
        let personalBusiness = {};

        businessesBD.forEach(b => {
            this.mapBusinessReturn(b);
            if (b.personal) {
                personalBusiness = b;
            } else {
                businesses.push(b);
            }
        });

        return {...response.success, personalBusiness, businesses };
    }

    /**
     * Responsible for assigning the role in a company to a user
     * 
     * @param data Business, user, and rol to assign.
     * @param user logged user extracted from token
     */
    @Transactional()
    async inviteTeammate(id: number, data: InviteTeammateDTO, user: IUserReq, response: any) {
        const u = await getRepository(User).createQueryBuilder('U')
                    .andWhere('U.mail = :mail', {mail: data.mail})
                    .getOne();

        if (!u) {
            throw new NotAcceptableException(userResponses.list.notFound);
        }

        this.validateRolesArray(data.roles, response);
        await this.rolesService.inviteTeammate(data.roles, id, u.id, user, response);

        return response.success;
    }

    /**
     * Method to use to update a business 
     * @param id business id
     * @param body Parameters to update.
     * @param user User performing the action.
     * @param response Response standards used in this method
     */
    async update(id: number, body: UpdateBusinessDto, user: IUserReq, response: any) {
        const businessDB = await this.findByIdOrFail(id, businessResponses.list.noPermission);

        await this.validateName(body, businessDB, response);

        if (body.imgCode) {
            await this.filesService.findByNameOrFail(body.imgCode);
        } else {
            const imagesAssigned = await this.getBusinessesImagesByUserWithPermission(user.userId);
            body.imgCode = this.getRandomAvatar(imagesAssigned);
        }

        const business = await this.updateAndGetRelations(body, businessDB, user, this.relations)
        .catch(() => {
            throw new InternalServerErrorException(response.error);
        });

        this.mapBusinessReturn(business);

        return this.formatReturn(response.success, 'business', business);
    }

    /**
     *  Delete all associated of this business
     * @param businessDeleted Deleted business
     * @param user Logged user
     */
    private async deleteAllAssociatedWithTheBusiness(businessDeleted: Business, user: IUserReq) {
        
        // Deleted all associated products
        for (const product of businessDeleted.products) {
            await this.productsService.delete(product.id, user, productResponses.delete);
        }

        // Deleted all associated locations
        for (const location of businessDeleted.locations) {
            await this.locationsService.delete(location.id, user, locationResponses.delete);
        }

        // Deleted all associated offers
        for (const offer of businessDeleted.offers) {
            await this.offersService.delete(offer.id, user);
        }

    }

    /**
     * Method to validate that the name do not exist
     * @param name name to verify
     * @param response response in case of error.
     * @param id identifier of a record, in case it is required to validate when updating
     */
    private async existsName(name: string, response: any, id?: number) {
        const business = await this.findBusinessByName(name);

        if (business && business.id !== id) {
            throw new NotAcceptableException(response);
        }

        return true;
    }

    /**
     * Method to find an Business by a giving name
     * @param name to filter 
     */
    private async findBusinessByName(name: string) {
        return await this.businessRepository.createQueryBuilder('S')
                .andWhere('S.status <> :status', {status: Status.DELETED})
                .andWhere('NOT S.personal')
                // Case insensitive search
                .andWhere('LOWER(S.name) = :name', {name: name.toLowerCase()})
                .getOne();
    }

    /**
     * Find all businesses that a user has access to
     * @param idUser id of user
     */
    private async findBusinessesByUserWithPermission(idUser: number): Promise<Business[]> {
        const businesses = await this.businessRepository.createQueryBuilder('b')
                .innerJoin('b.userBusinessRoles', 'ubr')
                .leftJoinAndSelect('b.locations', 'l')
                .leftJoinAndSelect('l.municipality', 'm')
                .leftJoinAndSelect('b.image', 'i')
                .where('ubr.id_user = :id ', { id: +idUser})
                .andWhere('not ubr.disabled')
                .andWhere('b.status <> :status', {status: Status.DELETED})
                .orderBy('b.name', 'ASC')
                .getMany();
        return businesses;
    }

    /**
     * Finds a business with id specified
     * @param id: id of the business to seek 
     * @param response Response in case of error
     */
    private async findByIdOrFail(id: number, response: any) {
        const business = await this.businessRepository.findOneOrFail(id)
            .catch(() => {
                throw new NotAcceptableException(response);
            });
            
        return business;
    }

    /**
     * Finds a business with id specified
     * @param id: id of the business to seek 
     * @param response Response in case of error
     */
    private async findByIdWithRelationsOrFail(id: number, response: any, relations: string[]) {
        const business = await this.businessRepository.findOneOrFail(id,
            { 
                where: { status: Not(Status.DELETED) },
                relations 
            })
            .catch(() => {
                throw new NotAcceptableException(response);
            });
            
        return business;
    }

    /**
     *  Cast some data of the business to return it.
     * @param business Business to return
     */
    private mapBusinessReturn(business: any) {
        business.id = +business.id;
        business.legalRepresentative = +business.legalRepresentative;
        delete business.modificationUser;

        if (business.legalRepresentativeEntity) {
            business.legalRepresentativeEntity.id = +business.legalRepresentativeEntity.id;
        }

        if (business.wallet) {
            business.wallet.balance = Number(business.wallet.balance);
            business.wallet.id = +business.wallet.id;
        }

        this.setDefaultColumnForImages(business['image']);
    }

    /**
     * Set a user as a Business Administrator when creating an business
     * 
     * @param user logged user extracted from token
     * @param business business object to which the user is going to be set as administrator
     */
    private async setAdminUserRolesBusiness(user: IUserReq, business: Business) {
        await this.rolesService.setAdminUserRolesBusiness(user, business, businessResponses.creation.assignRoleError);
    }

    /**
     * Map user Role with the schema user-rol
     * @param object query result
     */
    private userBusinessRoleMap(object) {
        if (!object) { return []; }

        const user = {...object};
        user.roles = [];
        delete user.userBusinessRoles;
        
        for (const [index, val] of object.userBusinessRoles.entries()) {
            if (index === 0) {
                user.business = val.business;
            }
            user.roles.push(val.rol);
        }
        return user;
    }

    /**
     * Method to validate the business name
     * @param body request body to verify.
     * @param business business in bd.
     * @param response Response standards used in this method
     */
    private async validateName(body: any, business: Business, response: any) {
        // validate if a business is personal and the name was not changed
        if (business.personal && body.name !== business.name ) {
            throw new ForbiddenException(response.cantChangeName);
        } 
        
        if (!business.personal) {
            // Validate that the name do not exist
            await this.existsName(body.name, response.nameBeUnique, business.id);
        }
    }

    private validateRolesArray(roles: any[], response: any) {
        const rolesUnique = [];

        if ( roles.length === 0 ) {
            throw new BadRequestException(response.rolesEmpty);
        }

        roles.forEach(element => {
            if (!rolesUnique[element.id]) {
                rolesUnique[element.id] = true;
            } else {
                throw new BadRequestException(response.rolesDuplicated);
            }
        });
    }
}
