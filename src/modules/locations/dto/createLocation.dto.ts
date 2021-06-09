import {
    IsIn, IsNotEmpty, IsOptional
} from 'class-validator';

export class CreateLocationDto {

    @IsNotEmpty()
    idBusiness: number;

    @IsNotEmpty()
    idMunicipality: number;

    @IsNotEmpty()
    postalCode: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsIn(['Active', 'Inactive'])
    status?: string;
}
