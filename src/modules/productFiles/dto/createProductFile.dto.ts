import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductFileDto {

    @IsNotEmpty()
    imgCode: string[];

    @IsOptional()
    idProduct?: number;

    @IsOptional()
    idProductVariation?: number;
}
