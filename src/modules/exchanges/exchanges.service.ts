import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { IResponseStructure } from '../../common/interfaces/responses.interface';
import { exchangeResponses } from '../../common/responses/exchanges.response';
import { BasicService } from '../../common/services/base.service';
import { Exchange } from '../../models/exchange.entity';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateExchangeDto } from './dto/createExchange.dto';
import { UpdateExchangeDto } from './dto/updateExchange.dto';

@Injectable()
export class ExchangesService extends BasicService<Exchange> {

    constructor(@InjectRepository(Exchange)
        private readonly exchangeRepository: Repository<Exchange>) {
            super(exchangeRepository);
    }

    /**
     *  Clean and cast the object to return it with the correctly data
     * @param exchange Exchange to clean
     */
    cleanExchangeReturn(exchange: any) {
        exchange.idUser = Number(exchange.idUser);
    }
    
    /**
     * Create a new exchange
     * 
     * @param body required data to create the exchange
     * @param user logged user extracted from token
     */
    async create(body: CreateExchangeDto, user: IUserReq) {
        const response = exchangeResponses.create;

        body.idUser = Number(user.userId);

        await this.checkExchangeExistByName(body.name, user.userId, response.nameBeUnique);
        
        const savedExchange = await this.saveAndGetRelations(body, user, ['category'])
            .catch( () => {
                throw new InternalServerErrorException(response.error);
            });

        this.cleanExchangeReturn(savedExchange);

        return this.formatReturn(response.success, 'exchange', savedExchange);
    }

    /**
     * Update a Exchange by its id
     * 
     * @param idExchange Exchange id to be modified
     * @param body data to update the exchange
     * @param user logged user extracted from token
     */
    async update(idExchange: number, body: UpdateExchangeDto, user: IUserReq) {
        const response = exchangeResponses.modification;

        const currentExchange = await this.exchangeRepository.findOneOrFail(idExchange,
                    {where: [{idUser: user.userId}]})
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        if (body.name !== currentExchange.name) {
            await this.checkExchangeExistByName(body.name, user.userId, response.nameBeUnique);
        }
        
        const updatedExchange = await this.updateEntity(body, currentExchange, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
        
        const exchangeObject = await this.exchangeRepository.findOne(updatedExchange.id, {relations: ['category']});
        
        this.cleanExchangeReturn(exchangeObject);

        return this.formatReturn(response.success, 'exchange', exchangeObject);
    }

    /**
     * Find all the exchanges tha belong to logged user
     * 
     * @param user logged user extracted from token
     */
    async list(user: IUserReq) {
        const response = exchangeResponses.list;
        const exchanges = await this.exchangeRepository.find({where: [{idUser: user.userId}], relations: ['category']})
            .catch( () => {
                throw new InternalServerErrorException(response.error);
            });
        
        for (const exchange of exchanges){
            this.cleanExchangeReturn(exchange);
        } 
        
        return this.formatReturn(response.success, 'exchange', exchanges);
 
    }

    /**
     * Disable a exchange
     * 
     * @param id exchange id that is going to be disabled
     * @param user logged user extracted from token
     */
    async disable(id: number, user: IUserReq) {
        const response = exchangeResponses.disable;

        const exchange = await this.exchangeRepository.findOneOrFail(id, {where: [{idUser: user.userId}], relations: ['category']})
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        await this.disableEntityByStatus(exchange, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
        
        this.cleanExchangeReturn(exchange);

        return this.formatReturn(response.success, 'exchange', exchange);

    }

    /**
     * Enable an exchange by its id
     * 
     * @param id exchange id that is going to be enabled
     * @param user logged user extracted from token
     */
    async activate(id: number, user: IUserReq) {
        const response = exchangeResponses.enable;
        const exchange = await this.exchangeRepository.findOneOrFail(id, {where: [{idUser: user.userId}], relations: ['category']})
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        const enabledExchange = await this.activateEntityByStatus(exchange, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        this.cleanExchangeReturn(exchange);

        return this.formatReturn(response.success, 'exchange', enabledExchange);

    }

    /**
     * Validate if a name exchange already exist by its user
     * 
     * @param exchangeName exchange name to be validated
     * @param idUser user who is trying to create the exchange
     */
    async checkExchangeExistByName(exchangeName: string, idUser: number, response: IResponseStructure) {
        const existingExchange = await this.exchangeRepository.findAndCount({where: [{name: exchangeName, idUser}]});

        if (existingExchange[1] > 0) {
            throw new NotAcceptableException(response);
        }
    }

}
