import { IsNotEmpty } from 'class-validator';

export class UpdateServiceFileDto {

    @IsNotEmpty()
    imgCode: string[];

    @IsNotEmpty()
    idService: number;
}
