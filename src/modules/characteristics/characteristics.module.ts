import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Characteristics } from '../../models';
import { CharacteristicsService } from './characteristics.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Characteristics]),
    ],
    providers: [CharacteristicsService],
    exports: [CharacteristicsService]
})
export class CharacteristicsModule {}
