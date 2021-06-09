import { Transform } from 'class-transformer';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ImageCode } from '../../../common/transforms/ImgCode.transform';

export class CreateBusinessDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmpty()
    idWallet: number;

    @IsEmpty()
    legalRepresentative: number;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @Transform(ImageCode)
    imgCode: string;

    @IsEmpty()
    personal?: boolean;
}
