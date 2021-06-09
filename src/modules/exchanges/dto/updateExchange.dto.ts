import { IsJSON, IsOptional } from 'class-validator';

export class UpdateExchangeDto {
    
    @IsOptional()
    idCategory: number;

    @IsOptional()
    name: string;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsJSON()
    properties: object | null;

    @IsOptional()
    @IsJSON()
    images: object | null;

    @IsOptional()
    isNew: boolean;
}
