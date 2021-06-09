import { Bind, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

    constructor(private readonly filesService: FilesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fieldSize: 30 * 1024 * 1024
        }
    }))
    @Bind(UploadedFile())
    @UseGuards(JwtAuthGuard)
    async uploadFile(file: any, @Body() body: any, @UserDec() user: IUserReq) {
        return this.filesService.uploadFileGoogleCloud(file, body.directory, user);
    }

}
