import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ImageCode } from '../../../common/transforms/ImgCode.transform';

export class UpdateBusinessDto {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @Transform(ImageCode)
    imgCode: string;
}
