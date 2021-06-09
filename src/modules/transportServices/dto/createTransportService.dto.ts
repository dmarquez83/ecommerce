import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { JsonParse } from '../../../common/transforms';

export class CreateTransportServiceDto {

    @IsNotEmpty()
    originAddress: string;

    @IsNotEmpty()
    @Transform(JsonParse)
    originCoordinates: object;

    @IsNotEmpty()
    destinationAddress: string;

    @IsNotEmpty()
    @Transform(JsonParse)
    destinationCoordinates: object;

    @IsNotEmpty()
    type: string;

    @IsOptional()
    packages: number;

    @IsOptional()
    passengers: number;

    @IsOptional()
    bags: number;

    @IsOptional()
    weight: number;

    @IsNotEmpty()
    distance: number;

    @IsNotEmpty()
    duration: number;

    @Transform( value => {
        if (!value || (typeof value === 'string' && value === '')) {
            return null;
        }
    
        return value;
    })
    @IsOptional()
    weightUnit: number;

    @Transform(JsonParse)
    @IsOptional()
    images: string[];
}
