import { IsEmail, IsOptional } from 'class-validator';

export class CreateGoogleUserDto {
    @IsOptional()
    username: string;

    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;

    @IsOptional()
    status: string;

    @IsEmail()
    mail: string;

    @IsOptional()
    provider: string | null;
}
