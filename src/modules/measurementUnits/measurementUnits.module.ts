import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementUnit } from '../../models/';
import { TranslationsModule } from '../translations/translations.module';
import { MeasurementUnitsController } from './measurementUnits.controller';
import { MeasurementUnitsService } from './measurementUnits.service';

@Module({
    imports: [TypeOrmModule.forFeature([MeasurementUnit]), TranslationsModule],
    providers: [MeasurementUnitsService],
    controllers: [MeasurementUnitsController],
    exports: [MeasurementUnitsService]
})
export class MeasurementUnitsModule {}
