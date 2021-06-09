import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../../models';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ImageServices } from './images.service';

@Module({
    imports: [TypeOrmModule.forFeature([File])],
    providers: [FilesService, ImageServices],
    controllers: [FilesController],
    exports: [FilesService]
})
export class FilesModule {}
