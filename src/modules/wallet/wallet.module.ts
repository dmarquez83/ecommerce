import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../models';
import { WalletService } from './wallet.service';

@Module({
    imports: [TypeOrmModule.forFeature([Wallet])],
    providers: [WalletService],
    exports: [WalletService]
})
export class WalletModule {}
