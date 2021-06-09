import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListOptions } from '../..//models';
import { ListOptionsService } from './listOptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ListOptions])],
  providers: [ListOptionsService]
})
export class ListOptionsModule {}
