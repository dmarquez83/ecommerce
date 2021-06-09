import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCombo } from '../../models';
import { PropertiesModule } from '../properties/properties.module';
import { PropertyCombosService } from './propertyCombos.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PropertyCombo]),
        PropertiesModule,
    ],
    providers: [PropertyCombosService],
    exports: [PropertyCombosService]
})
export class PropertyCombosModule {}
