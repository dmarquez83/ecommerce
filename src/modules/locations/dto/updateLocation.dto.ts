import {
    IsOptional, IsString
} from 'class-validator';

export class UpdateLocationDto {

    @IsOptional()
    idMunicipality: number;

    @IsOptional()
    @IsString()
    postalCode: string;

    @IsOptional()
    @IsString()
    description?: string;

}
