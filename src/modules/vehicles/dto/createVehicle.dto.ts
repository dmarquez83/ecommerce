import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { JsonParse } from '../../../common/transforms/';

export class CreateVehicleDto {

    @IsOptional()
    @Transform(JsonParse)
    images?: string[];

    @IsNotEmpty()
    model: string;

    @IsNotEmpty()
    color: string;

    @IsNotEmpty()
    plate: string;

    @IsNotEmpty()
    seats: number;

    @IsNotEmpty()
    idBrand: number;
}
