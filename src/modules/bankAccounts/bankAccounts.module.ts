import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from '../../models/';
import { BanksModule } from '../banks/banks.module';
import { WalletModule } from '../wallet/wallet.module';
import { BankAccountsController } from './bankAccounts.controller';
import { BankAccountsService } from './bankAccounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount]), BanksModule, WalletModule],
  providers: [BankAccountsService],
  controllers: [BankAccountsController]
})
export class BankAccountsModule {}
