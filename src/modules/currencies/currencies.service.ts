import { Injectable, InternalServerErrorException, NotAcceptableException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { Not, Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { currenciesResponses } from '../../common/responses/currencies.responses';
import { BasicService } from '../../common/services/base.service';
import { Currency } from '../../models/currency.entity';
import { CreateCurrencyDto } from './dto/createCurrency.dto';
import { UpdateCurrencyDto } from './dto/updateCurrency.dto';

@Injectable()
export class CurrenciesService extends BasicService<Currency> {
    responses = currenciesResponses;

    constructor(@InjectRepository(Currency)
        private readonly currencyRepository: Repository<Currency>) {
            super(currencyRepository);
    }

    /**
     * Create a Currency
     * @param body data to create
     * @param user logged user extracted from token
     */
    async create(body: CreateCurrencyDto, user: IUserReq) {
        const response = this.responses.create;

        await this.checkCodeOrNameExist(body, response.nameBeUnique, response.codeBeUnique);

        const savedCurrency = await this.save(body, user)
            .catch(() => {throw new InternalServerErrorException(response.error); });

        this.cleanCurrencyReturn(savedCurrency);
        
        return this.formatReturn(response.success, 'currency', savedCurrency);
    }

    /**
     *  Clean and cast the object currency before return it
     * @param currency 
     */
    cleanCurrencyReturn(currency: Currency) {
        delete currency.status;
        currency.vix = Number(currency.vix);
    }
    
    /**
     * Update a Currency
     * @param id Currency Id
     * @param body data to update
     * @param user logged user extracted from token
     */
    async update(id: number, body: UpdateCurrencyDto, user: IUserReq) {
        const response = this.responses.update;

        const currency = await this.currencyRepository.findOneOrFail(id,
            {where: [{status: Status.ENABLED}]})
            .catch(() => {
                throw new ForbiddenException(response.noPermission);
            });

        await this.checkCodeOrNameExist(body, response.nameBeUnique, response.codeBeUnique, id);

        const updatedCurrency = await this.updateEntity(body, currency, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });
        
        this.cleanCurrencyReturn(updatedCurrency);

        return this.formatReturn(response.success, 'currency', updatedCurrency);
    }

    /**
     * Enable a Currency
     * @param id Currency Id
     * @param user logged user extracted from token
     */
    async enable(id: number, user: IUserReq) {
        const response = this.responses.enable;

        const currency = await this.currencyRepository.findOneOrFail(id, {where: [{status: Status.DISABLED}]})
            .catch(() => {throw new ForbiddenException(response.noPermission); });
        
        const currencyEnabled = await this.activateEntityByStatus(currency, user)
            .catch(() => {throw new InternalServerErrorException(response.error); });

        this.cleanCurrencyReturn(currencyEnabled);

        return this.formatReturn(response.success, 'currency', currency);
    }

    /**
     * Disable a Currency
     * @param id Currency Id
     * @param user logged user extracted from token
     */
    async disable(id: number, user: IUserReq) {
        const response = await this.responses.disable;

        const currency = await this.currencyRepository.findOneOrFail(id)
            .catch(() => {throw new ForbiddenException(response.noPermission); });
        
        const currencyDisabled = await this.disableEntityByStatus(currency, user)
            .catch(() => {throw new InternalServerErrorException(response.error); });

        this.cleanCurrencyReturn(currencyDisabled);

        return this.formatReturn(response.success, 'currency', currencyDisabled);
    }

    /**
     * Find a Currency by its Id
     * @param id Currency Id
     */
    async findById(id: number) {
        const response = this.responses.list;

        const currency = await this.currencyRepository.findOneOrFail(id)
            .catch(() => { throw new ForbiddenException(response.noPermission); });

        this.cleanCurrencyReturn(currency);

        return this.formatReturn(response.success, 'currency', currency);
    }

    /**
     * Find all Currencies
     */
    async findAll() {
        const response = this.responses.list;

        const currencies = await this.currencyRepository.find({ where: [{ status: Status.ENABLED }] })
            .catch(() => { throw new InternalServerErrorException(response.error); });

        currencies.forEach( e => {
            this.cleanCurrencyReturn(e);
        });

        return this.formatReturn(response.success, 'currencies', currencies);
    }

    async checkCodeOrNameExist(body: CreateCurrencyDto | UpdateCurrencyDto, errorNameResponse: any, errorCodeResponse: any, idCurrency?: number) {
        const [currencies, count] = idCurrency ? 
            await this.currencyRepository.findAndCount({
                where: [{id: Not(idCurrency), code: body.code}, {id: Not(idCurrency), name: body.name}]
            }) :
            await this.currencyRepository.findAndCount({
                where: [{code: body.code}, {name: body.name}]
            });

        if (count > 0) {
            if (body.name === currencies[0].name) {throw new NotAcceptableException(errorNameResponse);}
            if (body.code === currencies[0].code) {throw new NotAcceptableException(errorCodeResponse);}           
        }

        return;
    }
}
