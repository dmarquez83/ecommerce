import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProductFileDto {

    @IsNotEmpty()
    imgCode: string[];

    @IsOptional()
    idProduct?: number;

    @IsOptional()
    idProductVariation?: number;
}
