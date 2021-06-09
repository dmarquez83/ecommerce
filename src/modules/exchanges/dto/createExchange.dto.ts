import { IsEmpty, IsJSON, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExchangeDto {

    @IsEmpty()
    idUser: number;
    
    @IsNotEmpty()
    idCategory: number;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsJSON()
    properties: object | null;

    @IsOptional()
    @IsJSON()
    images: object | null;

    @IsNotEmpty()
    isNew: boolean;

}
