import { IsNotEmpty } from 'class-validator';

export class CreateServiceFileDto {

    @IsNotEmpty()
    imgCode: string[];

    @IsNotEmpty()
    idService: number;
}
