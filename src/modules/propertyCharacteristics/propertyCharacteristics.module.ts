import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCharacteristic } from '../../models';
import { PropertyCharacteristicsService } from './propertyCharacteristics.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PropertyCharacteristic]),
    ],
    providers: [PropertyCharacteristicsService],
    exports: [PropertyCharacteristicsService]
})
export class PropertyCharacteristicsModule {}
