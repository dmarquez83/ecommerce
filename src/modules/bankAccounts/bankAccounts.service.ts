import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { banksAccountsResponses } from '../../common/responses/bankAccounts.response';
import { BasicService } from '../../common/services/base.service';
import { BankAccount } from '../../models/bankAccount.entity';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { BanksService } from '../banks/banks.service';
import { WalletService } from '../wallet/wallet.service';
import { CreateBankAccountDto } from './dto/createBankAccount.dto';
import { UpdateBankAccountDto } from './dto/updateBankAccount.dto';

@Injectable()
export class BankAccountsService extends BasicService<BankAccount> {

    responses = banksAccountsResponses;

    constructor(@InjectRepository(BankAccount)
        private readonly bankAccountRepository: Repository<BankAccount>,
                private readonly bankService: BanksService,
                private readonly walletService: WalletService) {
            super(bankAccountRepository);
    }

    /**
     *  Clean bankAccount object before return it
     * @param bankAccount BankAccount object
     */
    cleanBankAccounts(bankAccount: BankAccount) {
        bankAccount.id = Number(bankAccount.id);
        bankAccount.idWallet = Number(bankAccount.idWallet);
        delete bankAccount.status;

        if (bankAccount.wallet) {
            bankAccount.wallet.id = Number(bankAccount.wallet.id);
            bankAccount.wallet.balance = Number(bankAccount.wallet.balance);
        }
    }

    /**
     * Find a Bank Account by its Id
     * @param id Bank Account number
     */
    async findById(id: number) {
        const response = this.responses.list;

        const bankAccount = await this.bankAccountRepository.findOneOrFail({ 
            where: [{ id, status: Status.ENABLED}],
            relations: ['wallet', 'bank']
        }).catch(() => { throw new ForbiddenException(response.noPermission); });

        this.cleanBankAccounts(bankAccount);

        return this.formatReturn(response.success, 'bankAccount', bankAccount);
    }

    /**
     * Find a Bank Account by its wallet
     * @param idWallet wallet Id
     */
    async findByWallet(idWallet: number) {
        const response = this.responses.list;

        const bankAccount = await this.bankAccountRepository.findOneOrFail({
            where: [{idWallet, status: Status.ENABLED}],
            relations: ['wallet', 'bank']
        }).catch(() => { throw new ForbiddenException(response.noPermission); });
        
        this.cleanBankAccounts(bankAccount);

        return this.formatReturn(response.success, 'bankAccount', bankAccount);
    }

    /**
     * Create a Bank Account
     * @param body data to create
     * @param user logged user extracted from token
     */
    async create(body: CreateBankAccountDto, user: IUserReq) {
        const response = this.responses.create;

        await this.checkAccountExist(body.account, response.accountExist);
        await this.checkBankExist(body.idBank, response.bankMustExist);
        await this.checkWalletExist(body.idWallet, response.walletMustExist);

        const savedBankAccount = await this.saveAndGetRelations(body, user, ['bank', 'wallet'])
            .catch((e) => {throw new InternalServerErrorException(e); });
        
        this.cleanBankAccounts(savedBankAccount);

        return this.formatReturn(response.success, 'bankAccount', savedBankAccount);
    }

    /**
     * Update a Bank Account
     * 
     * @param id Bank Account Id
     * @param body data to upate
     * @param user logged user extracted from token
     */
    async update(id: number, body: UpdateBankAccountDto, user: IUserReq) {
        const response = this.responses.update;

        const bankAccount = await this.bankAccountRepository.findOneOrFail(id, { where: [{status: Status.ENABLED}]})
            .catch(() => {throw new ForbiddenException(response.noPermission); });

        if (body.account !== bankAccount.account && body.account) {
            await this.checkAccountExist(body.account, response.accountExist);
        }

        if (body.idBank) {await this.checkBankExist(body.idBank, response.bankMustExist); }
        if (body.idWallet) {await this.checkWalletExist(body.idWallet, response.walletMustExist); }

        const updatedBankAccount = await this.updateAndGetRelations(body, bankAccount, user, ['bank', 'wallet'])
            .catch(() => {throw new InternalServerErrorException(response.error); });
        
        this.cleanBankAccounts(updatedBankAccount);

        return this.formatReturn(response.success, 'bankAccount', updatedBankAccount);
    }

    /**
     * Enable a Bank Account
     * @param id Bank Account Id
     * @param user logged user extracted from token
     */
    async enable(id: number, user: IUserReq) {
        const response = this.responses.enable;

        const bankAccount = await this.bankAccountRepository.findOneOrFail(id, { 
            where: [{status: Status.DISABLED}],
            relations: ['bank', 'wallet']
        }).catch(() => { throw new ForbiddenException(response.noPermission); });

        await this.activateEntityByStatus(bankAccount, user)
            .catch(() => {throw new InternalServerErrorException(response.error); });

        this.cleanBankAccounts(bankAccount);
        
        return this.formatReturn(response.success, 'bankAccount', await this.cleanObjects(bankAccount));               
    }

    /**
     * Disable a Bank Account
     * 
     * @param id Bank Account Id
     * @param user logged user extracted from token
     */
    async disable(id: number, user: IUserReq) {
        const response = this.responses.disable;

        const bankAccount = await this.bankAccountRepository.findOneOrFail(id, { 
            where: [{status: Status.ENABLED}],
            relations: ['bank', 'wallet']
        }).catch(() => { throw new ForbiddenException(response.noPermission); });

        await this.disableEntityByStatus(bankAccount, user)
        .catch(() => {throw new InternalServerErrorException(response.error); });

        this.cleanBankAccounts(bankAccount);
    
        return this.formatReturn(response.success, 'bankAccount', await this.cleanObjects(bankAccount)); 
    }

    /**
     * Check if Account number exist
     * @param account Account number
     * @param errorResponse response in case of an error 
     */
    async checkAccountExist(account: string, errorResponse: any) {
        const [, count] = await this.bankAccountRepository.findAndCount({where: [{account}]});

        if (count > 0) {throw new NotAcceptableException(errorResponse); }
    }

    /**
     * Check if a Bank with id specified exist
     * @param idBank Bank Id
     * @param errorResponse response in case of an error 
     */
    async checkBankExist(idBank: number, errorResponse: any) {
        await this.bankService.findOneWithOptionsOrFail({where: [{id: idBank, status: Status.ENABLED}]})
            .catch(() => {throw new NotAcceptableException(errorResponse); });
    }

    /**
     * Check if a Wallet with Id specified exist
     * @param idWallet wallet Id
     * @param errorResponse response in case of an error
     */
    async checkWalletExist(idWallet: number, errorResponse: any) {
        await this.walletService.findOneWithOptionsOrFail({ where: [{id: idWallet}]})
            .catch(() => { throw new NotAcceptableException(errorResponse); });
    }
}
