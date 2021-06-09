import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from '../../models';
import { VehicleFilesModule } from '../vehicleFiles/vehicleFiles.module';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
    imports: [TypeOrmModule.forFeature([Vehicle]), VehicleFilesModule],
    providers: [VehiclesService],
    controllers: [VehiclesController]
})
export class VehiclesModule { }
