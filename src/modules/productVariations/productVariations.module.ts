import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariation } from '../../models';
import { ProductFilesModule } from '../productFiles/productFiles.module';
import { ProductStocksModule } from '../productStocks/productStocks.module';
import { PropertyCombosModule } from '../propertyCombos/propertyCombos.module';
import { ProductVariationsService } from './productVariations.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductVariation]),
        ProductFilesModule,
        PropertyCombosModule,
        ProductStocksModule
    ],
    providers: [ProductVariationsService],
    exports: [ProductVariationsService]
})
export class ProductVariationsModule {}
