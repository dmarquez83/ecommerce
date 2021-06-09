import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListOptions, Lists, MeasurementUnit } from '../../models';
import { ListOptionsService } from '../listOptions/listOptions.service';
import { MeasurementUnitsModule } from '../measurementUnits/measurementUnits.module';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
@Module({
  imports: [TypeOrmModule.forFeature([Lists, ListOptions]), MeasurementUnitsModule],
  controllers: [ListsController],
  providers: [ListsService, ListOptionsService]
})
export class ListsModule {}
