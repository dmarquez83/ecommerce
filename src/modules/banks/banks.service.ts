import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { banksResponses } from '../../common/responses/banks.response';
import { BasicService } from '../../common/services/base.service';
import { Bank } from '../../models';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { CreateBankDto } from './dto/createBank.dto';
import { UpdateBankDto } from './dto/updateBank.dto';

@Injectable()
export class BanksService extends BasicService<Bank> {

    responses = banksResponses;

    constructor(@InjectRepository(Bank)
        private readonly bankRepository: Repository<Bank>) {
            super(bankRepository);
    }

    /**
     * Create a Bank
     * 
     * @param body data to create
     * @param user logged user extracted from token
     */
    async create(body: CreateBankDto, user: IUserReq) {
        const response = this.responses.create;
        
        await this.checkNameExist(body.name, response.nameExist);
        await this.checkCodeExist(body.code, response.codeExist);

        const bank = await this.save(body, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });
        delete bank.status;
        return this.formatReturn(response.success, 'bank', bank);

    }

    /**
     * Update a Bank
     * 
     * @param id Bank Id
     * @param body data to update
     * @param user logged user extracted from token 
     */
    async update(id: number, body: UpdateBankDto, user: IUserReq) {
        const response = this.responses.update;

        if (body.name) { await this.checkNameExist(body.name, response.nameExist, id); }
        if (body.code) { await this.checkCodeExist(body.code, response.codeExist, id); }

        const bank = await this.bankRepository.findOneOrFail(id, {where: [{status: Status.ENABLED}]})
            .catch(() => { throw new ForbiddenException(response.noPermission); });

        const updatedBank = await this.updateEntity(body, bank, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'bank', updatedBank);
        
    }

    /**
     * Disable a Bank
     * 
     * @param id Bank Id
     * @param user logged user extracted from token 
     */
    async disable(id: number, user: IUserReq) {
        const response = this.responses.disable;

        const bank = await this.bankRepository.findOneOrFail(id, {where: [{status: Status.ENABLED}]})
            .catch(() => { throw new ForbiddenException(response.noPermission); });

        await this.disableEntityByStatus(bank, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'bank', await this.cleanObjects(bank));
    }

    /**
     * Enable a Bank
     * 
     * @param id Bank Id
     * @param user logged user extracted from token 
     */
    async enable(id: number, user: IUserReq) {
        const response = this.responses.enable;

        const bank = await this.bankRepository.findOneOrFail(id, {where: [{status: Status.DISABLED}]})
            .catch(() => { throw new ForbiddenException(response.attrMustExist); });

        await this.activateEntityByStatus(bank, user)
        .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'bank', await this.cleanObjects(bank));
    }

    /**
     * Check if name exist
     * @param name Bank name
     * @param errorResponse Response error
     * @param idBank Bank Id
     */
    async checkNameExist(name: string, errorResponse: any, idBank?: number) {
        const [, count] = idBank ?
        await this.bankRepository.findAndCount({where: [{name, id: Not(idBank)}]}) :
        await this.bankRepository.findAndCount({where: [{name}]});

        if (count > 0) { throw new NotAcceptableException(errorResponse); }

        return;
    }

    /**
     * Check if code exist
     * @param code Bank code
     * @param errorResponse Response error
     * @param idBank Bank Id
     */
    async checkCodeExist(code: string, errorResponse: any, idBank?: number) {
        const [, count] = idBank ?
        await this.bankRepository.findAndCount({where: [{code, id: Not(idBank)}]}) :
        await this.bankRepository.findAndCount({where: [{code}]});

        if (count > 0) { throw new NotAcceptableException(errorResponse); }

        return;
    }
}
