import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProperty, Property } from '../../models';
import { CategoryPropertiesController } from './categoryProperties.controller';
import { CategoryPropertiesService } from './categoryProperties.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryProperty, Property])],
  providers: [CategoryPropertiesService],
  controllers: [CategoryPropertiesController]
})
export class CategoryPropertiesModule {}
