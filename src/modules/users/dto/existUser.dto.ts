import {
    IsEmail, IsNotEmpty, IsString
} from 'class-validator';

export class EmailUsernameExistDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    mail: string;
}
