import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipality } from '../../models';
import { StatesModule } from '../states/states.module';
import { MunicipalitiesController } from './municipalities.controller';
import { MunicipalitiesService } from './municipalities.service';

@Module({
  imports: [TypeOrmModule.forFeature([Municipality]), StatesModule],
  providers: [MunicipalitiesService],
  controllers: [MunicipalitiesController]
})
export class MunicipalitiesModule {}
