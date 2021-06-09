import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from '../../models/exchange.entity';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from './exchanges.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange])],
  providers: [ExchangesService],
  controllers: [ExchangesController]
})
export class ExchangesModule {}
