import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckCharacteristicUnitInProperties } from '../../common/decorators/CheckCharacteristicUnitInProperties.decorator';
import { LocationValidator } from '../../common/decorators/LocationValidator.decorator';
import { Product } from '../../models/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { CharacteristicsModule } from '../characteristics/characteristics.module';
import { LocationsModule } from '../locations/locations.module';
import { ProductFilesModule } from '../productFiles/productFiles.module';
import { ProductStocksModule } from '../productStocks/productStocks.module';
import { ProductVariationsModule } from '../productVariations/productVariations.module';
import { PropertyCombosModule } from '../propertyCombos/propertyCombos.module';
import { ProductWordsModule } from '../productWords/productWords.module'
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        ProductFilesModule,
        ProductVariationsModule,
        PropertyCombosModule,
        CategoriesModule,
        ProductStocksModule,
        LocationsModule,
        CharacteristicsModule,
        ProductWordsModule
    ],
    providers: [LocationValidator, CheckCharacteristicUnitInProperties, ProductsService],
    controllers: [ProductsController],
    exports: [ProductsService],
})
export class ProductsModule { }
