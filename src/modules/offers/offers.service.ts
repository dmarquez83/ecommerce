import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { IPaginationOptions } from '../../common/interfaces/paginateOptions.interface';
import { IResponseStructure } from '../../common/interfaces/responses.interface';
import { offerResponses } from '../../common/responses/offers.response';
import { BasicService } from '../../common/services/base.service';
import { Offer } from '../../models/offer.entity';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateOfferDto } from './dto/createOffer.dto';
import { UpdateOfferDto } from './dto/updateOffer.dto';

@Injectable()
export class OffersService extends BasicService<Offer> {

    constructor(@InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>) {
            super(offerRepository);
    }

    /**
     * Create a new offer
     * 
     * @param body data to create the offer
     * @param user logged user extracted from the token
     */
    async create(body: CreateOfferDto, user: IUserReq ) {
        const response = offerResponses.creation;

        // Check the name of the offer
        await this.checkOfferNameByBusiness(  
                        body.name , 
                        body.idBusiness, 
                        response.nameBeUnique
                    );
        // Perform saving
        const savedOffer = await this.saveAndGetRelations(  body, user, 
                                                            ['business', 'category'])
                                .catch(() => {
                                    throw new InternalServerErrorException( 
                                            response.error
                                        );
                                    });
                   
        return this.formatReturn(response.success, 'offer', savedOffer); 
    }

    /**
     * Update a offer
     * 
     * @param id offer id to be modified
     * @param body data to update the offer
     * @param user logged user extracted from token
     */
    async update(id: number, body: UpdateOfferDto, user: IUserReq) {
        const response = offerResponses.modification;

        const currentOffer = await this.offerRepository.findOneOrFail(id, {relations: ['category', 'business']})
            .catch(() => {
                throw new ForbiddenException(
                    response.noPermission
                );
        });

        // Checks before update
        this.checkOfferCanBeModified(currentOffer, response.offerDisabled);

        // Check the name of the offer
        await this.checkOfferNameByBusiness(  body.name, currentOffer.idBusiness, 
                                                response.nameBeUnique, id);

        const updatedOffer = await this.updateEntity(body, currentOffer, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'offer', updatedOffer);
    }

    /**
     * Find an offer by its id
     * 
     * @param idOffer offer id to be listed
     * @param user logged user extracted from the token
     */
    async findById(idOffer: number, user: IUserReq) {
        const response = offerResponses.list;

        const currentOffer = await this.offerRepository.findOneOrFail(idOffer, 
            {
                where: { status: Not(Status.DELETED) },
                relations: ['category', 'business']
            })
        .catch(() => {
            throw new ForbiddenException(response.noPermission);
        });

        return this.formatReturn(response.success, 'offer', currentOffer);
    }

    /**
     * Find offers by business
     * 
     * @param idBusiness business id
     * @param options paginate options
     * @param user logged user extracted from token
     */
    async findOfferByBusiness(idBusiness: number, options: IPaginationOptions, user: IUserReq) {
        const response = offerResponses.list;

        options.where = [{idBusiness: +idBusiness}];

        const query = this.offerRepository.createQueryBuilder('O')
            .innerJoinAndSelect('O.category', 'C', 'O.idCategory = C.id')
            .innerJoinAndSelect('O.business', 'E', 'O.idBusiness = E.id');

        return this.formatReturn(response.success, 'result', await this.paginate(options, query));
    }

    /**
     * Disable offer
     * 
     * @param id offer id to be disable
     * @param user logged user extracted from token
     */
    async disable(id: number, user: IUserReq) {
        const response = offerResponses.disable;

        const currentOffer = await this.offerRepository.findOneOrFail(id, {relations: ['category', 'business']})
            .catch( () => {
                throw new ForbiddenException(response.noPermission);
        });

        currentOffer.status = Status.DISABLED;

        await this.offerRepository.save(currentOffer, { data: user })
                .catch( () => {
                    throw new InternalServerErrorException(response.error);
                });

        return this.formatReturn(response.success, 'offer', currentOffer);
    }

    /**
     * Delete offer
     * 
     * @param id offer id to be delete
     * @param user logged user extracted from token
     */
    async delete(id: number, user: IUserReq) {
        const response = offerResponses.disable;

        const currentOffer = await this.offerRepository.findOneOrFail(id, 
            {relations: ['category', 'business']})
            .catch( () => {
                throw new ForbiddenException(response.noPermission);
        });

        await this.deleteEntityByStatus(currentOffer, user)
                .catch( () => {
                    throw new InternalServerErrorException(response.error);
                });

        return this.formatReturn(response.success, 'offer', currentOffer);
    }

    /**
     * Validate if the name already exists in a Business
     * 
     * @param name name to be validated
     * @param idBusiness Business where it is required to validate the name
     * @param response error response
     * @param id offer identifier
     */
    async checkOfferNameByBusiness( name: string, 
                                    idBusiness: number, 
                                    response: IResponseStructure, 
                                    id?: number) {

        const query = this.offerRepository.createQueryBuilder('O');
           
        // in case there is an offer identifier, it must be validated that 
        // the name does not belong to it                                    
        if (id) {
            query.where('id <> :id', {id});
        }

        const result = await query.andWhere('(O.name = :name AND O.idBusiness = :idBusiness)', 
        {name, idBusiness}).getOne();

        // in case there is a result, an error has to be returned, because 
        // that name already exists in the specified Business
        if (result) { 
            throw new InternalServerErrorException(response);
        }
        
        return true;
    }

    /**
     * Validate if an offer can be modified
     * 
     * @param offer offer to be validated
     * @param response response in case of error
     */
    checkOfferCanBeModified(offer: Offer, response: IResponseStructure) {
        if (offer.status !== Status.ENABLED) {
            throw new NotAcceptableException(response);
        }
    }
}
