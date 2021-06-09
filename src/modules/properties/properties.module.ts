import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../../models';
import { CharacteristicsModule } from '../characteristics/characteristics.module';
import { PropertyCharacteristicsModule } from '../propertyCharacteristics/propertyCharacteristics.module';
import { PropertiesService } from './properties.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Property]),
        CharacteristicsModule,
        PropertyCharacteristicsModule
    ],
    providers: [PropertiesService],
    exports: [PropertiesService]
})
export class PropertiesModule {}
