import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleFile } from '../../models';
import { FilesModule } from '../files/files.module';
import { VehicleFilesController } from './vehicleFiles.controller';
import { VehicleFilesService } from './vehicleFiles.service';

@Module({
    imports: [TypeOrmModule.forFeature([VehicleFile]), FilesModule],
    providers: [VehicleFilesService],
    controllers: [VehicleFilesController],
    exports: [VehicleFilesService]
})
export class VehicleFilesModule { }
