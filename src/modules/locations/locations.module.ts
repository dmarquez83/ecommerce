import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location} from '../../models';
import { ProductStocksModule } from '../productStocks/productStocks.module';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

@Module({
    imports: [TypeOrmModule.forFeature([Location]), ProductStocksModule],
    providers: [LocationsService],
    controllers: [LocationsController],
    exports: [LocationsService]
})
export class LocationsModule { }
