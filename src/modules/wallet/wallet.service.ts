import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as lodash from 'lodash';
import { Repository } from 'typeorm';
import { userResponses } from '../../common/responses/users.response';
import { BasicService } from '../../common/services/base.service';
import { Wallet } from '../../models/wallet.entity';
import { CreateWalletDto } from './dto/createWallet.dto';
import { IWalletCreated } from './interfaces/walletCreated.interface';

@Injectable()
export class WalletService extends BasicService<Wallet> {

    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>,
        private readonly configService: ConfigService) {
            super(walletRepository);
        }
    
    /**
     * Creates a new wallet 
     * @param userId: id of the user that creates the wallet
     */
    async createWallet(userId): Promise<IWalletCreated> {
    
        const bodyWallet = new CreateWalletDto();
        
        bodyWallet.creationUser = userId;
        bodyWallet.code = await this.generateCode();
        bodyWallet.creationDate = new Date();
        bodyWallet.balance = 0.0;
        
        return await this.walletRepository.save(bodyWallet)
            .catch(() => {
                throw new InternalServerErrorException(userResponses.creation.cantCreateWallet);
            });
    }

    /**
     * Generate code for a new wallet
     */
    async generateCode() {
        // Chars allowed to generate a new wallet
        const walletChars = this.configService.get('WALLET_CHARS');

        let i = 0;
        let wcode = '';

        // In case a wallet code already exist, it generates until a unique code is created
        do {
            const pwd = lodash.sampleSize(walletChars, 15);
            wcode = pwd.join('');
            // Verifying the newly generated code is not in the database
            const existWallet = await this.walletRepository.findOne({where: {code: wcode}}) ;
            i = existWallet ? 1 : 0;

        } while (i === 1);

        return wcode;
    }

}
