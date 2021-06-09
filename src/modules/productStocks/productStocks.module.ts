import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStock } from '../../models';
import { ProductStocksService } from './productStocks.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductStock]),
    ],
    providers: [ProductStocksService],
    exports: [ProductStocksService]
})
export class ProductStocksModule {}
