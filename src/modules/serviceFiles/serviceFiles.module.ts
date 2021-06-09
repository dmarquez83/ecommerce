import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceFile } from '../../models';
import { FilesModule } from '../files/files.module';
import { ServiceFilesService } from './serviceFiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceFile]), FilesModule],
  providers: [ServiceFilesService],
  exports: [ServiceFilesService]
})
export class ServiceFilesModule {}
