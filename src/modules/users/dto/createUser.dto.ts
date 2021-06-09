import { Transform } from 'class-transformer';
import {
    IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString
} from 'class-validator';
import { ImageCode } from '../../../common/transforms/ImgCode.transform';

export class CreateUserDto {
    @IsOptional()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    mail: string;

    @IsOptional()
    @Transform(ImageCode)
    imgCode?: string;

    @IsOptional()
    @IsString()
    identityDocument?: string | null;

    @IsOptional()
    idMunicipality?: number | null;

    @IsOptional()
    telephone?: string | null;

    @IsOptional()
    address?: string | null;

    @IsOptional()
    provider?: string | null;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEmpty()
    idWallet?: number;
}
