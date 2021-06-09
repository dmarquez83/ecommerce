import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File, VehicleBrand } from '../../models';
import { FilesModule } from '../files/files.module';
import { VehicleBrandsController } from './vehicleBrands.controller';
import { VehicleBrandsService } from './vehicleBrands.service';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleBrand]), FilesModule],
  providers: [VehicleBrandsService],
  controllers: [VehicleBrandsController]
})
export class VehicleBrandsModule {}
