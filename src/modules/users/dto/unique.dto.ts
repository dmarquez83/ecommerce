import {
    IsEmail, IsNotEmpty, IsOptional, IsString
} from 'class-validator';

export class UserUniqueFieldsDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    mail: string;

    @IsOptional()
    @IsString()
    identityDocument?: string | null;
}
