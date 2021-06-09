import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFile } from '../../models';
import { FilesModule } from '../files/files.module';
import { ProductFilesController } from './productfiles.controller';
import { ProductFilesService } from './productFiles.service';

@Module({
    imports: [
        FilesModule, TypeOrmModule.forFeature([ProductFile])
    ],
    providers: [ProductFilesService],
    controllers: [ProductFilesController],
    exports: [ProductFilesService]
})
export class ProductFilesModule { }
