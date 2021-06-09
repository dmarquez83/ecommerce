import { Transform } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';
import { ImageCode } from '../../../common/transforms/ImgCode.transform';

export class UpdateUserDto {

    @IsOptional()
    username: string;

    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;

    @IsOptional()
    @IsEmail()
    mail: string;

    @IsOptional()
    @Transform(ImageCode)
    imgCode: string;

    @IsOptional()
    identityDocument: string;

    @IsOptional()
    idMunicipality: number;

    @IsOptional()
    telephone: string;

    @IsOptional()
    address: string | null;
}
