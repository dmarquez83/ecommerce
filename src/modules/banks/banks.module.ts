import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from '../../models';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  controllers: [BanksController],
  providers: [BanksService],
  exports: [BanksService]
})
export class BanksModule {}
