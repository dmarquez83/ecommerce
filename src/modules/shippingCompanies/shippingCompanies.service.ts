// tslint:disable-next-line: ordered-imports
import { Injectable, InternalServerErrorException, NotAcceptableException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { shippingCompaniesResponses } from '../../common/responses/shippingCompanies.response';
import { BasicService } from '../../common/services/base.service';
import { ShippingCompany } from '../../models/shippingCompany.entity';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { ShippingCompanyCreateDto } from './dto/shippingCompanyCreate.dto';
import { ShippingCompanyUpdateDto } from './dto/shippingCompanyUpdate.dto';

@Injectable()
export class ShippingCompaniesService extends BasicService<ShippingCompany> {

    response = shippingCompaniesResponses;

    constructor(@InjectRepository(ShippingCompany)
        private readonly shippingCompanyRepository: Repository<ShippingCompany>) {
            super(shippingCompanyRepository);
    }
    
    /**
     * Find All Shipping Companies
     */
    async findAll() {
        const listResponse = this.response.list;

        const shippingCompanies = await this.shippingCompanyRepository.find({
            where: [{status: Status.ENABLED}]
        });

        return this.formatReturn(listResponse.success, 'shippingCompanies', shippingCompanies);
    }

    /**
     * Find a Shipping Company by its id
     * @param id Shipping Company id
     */
    async findById(id: number) {
        const listResponse = this.response.list;

        const shippingcompany = await this.shippingCompanyRepository.findOne(id)
            .catch(() => {throw new ForbiddenException(listResponse.error); });

        return this.formatReturn(listResponse.success, 'shippingCompany', {...shippingcompany});
    }

    /**
     * Disable a Shipping Company by its id
     */
    async disable(id: number, user: IUserReq) {
        const disableResponse = this.response.disable;

        const shippingCompany = await this.shippingCompanyRepository.findOneOrFail(id)
            .catch(() => {throw new ForbiddenException(disableResponse.noPermission); });

        await this.disableEntityByStatus(shippingCompany, user)
            .catch(() => {throw new InternalServerErrorException(disableResponse.error); });

        return this.formatReturn(disableResponse.success, 'shippingCompany', shippingCompany);
    }

    /**
     * Enable a Shipping Company
     */
    async enable(id: number, user: IUserReq) {
        const response = this.response.enable;

        const shippingCompany = await this.shippingCompanyRepository.findOneOrFail(id)
            .catch(() => {throw new ForbiddenException(response.noPermission); });

        await this.activateEntityByStatus(shippingCompany, user)
            .catch(() => {throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'shippingCompany', shippingCompany);
    }

    /**
     * Create a new Shipping Company
     * @param body data to create
     * @param user logged user extracted from token
     */
    async create(body: ShippingCompanyCreateDto, user: IUserReq) {
        const createResponse = this.response.create;

        await this.checkNameExist(body.name, createResponse.nameExist);
        
        const savedShippingCompany = await this.save(body, user)
            .catch(() => {      
                throw new InternalServerErrorException(createResponse.error);
            });
    
        delete savedShippingCompany.status;

        return this.formatReturn(createResponse.success, 'shippingCompany', savedShippingCompany);

    }

    /**
     * Mopify a Shipping Company by its id
     * 
     * @param id Shipping company id to update
     * @param body data to update
     * @param user logged user extracted from token
     */
    async update(id: number, body: ShippingCompanyUpdateDto, user: IUserReq) {
        const updateResponse = this.response.update;

        const shippingCompany = await this.shippingCompanyRepository.findOneOrFail(id)
            .catch(() => {
                throw new ForbiddenException(updateResponse.noPermission);
            });

        if (body.name ) { await this.checkNameExist(body.name, updateResponse.nameExist, shippingCompany.id); }

        const updatedShippingCompany = await this.updateEntity(body, shippingCompany, user)
            .catch(() => {throw new InternalServerErrorException(updateResponse.error); });

        return this.formatReturn(updateResponse.success, 'shippingCompany', updatedShippingCompany);

    }
    
    /**
     * Check if name exist in Shipping Company table
     * @param name Shipping Company name
     * @param errorResponse Error response in case an error ocur
     */
    async checkNameExist(name: string, errorResponse: any, idCompany?: number) {
        const [, count] = idCompany ? 
        await this.shippingCompanyRepository.findAndCount({where: [{name, id:  Not(idCompany)}]}) :
        await this.shippingCompanyRepository.findAndCount({where: [{name}]});
        
        if (count > 0) { throw new NotAcceptableException(errorResponse); }
    }
 
}
