import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { JsonParse } from '../../../common/transforms';

export class UpdateTransportServiceDto {

    @IsOptional()
    id: number;
    
    @IsOptional()
    originAddress: string;

    @IsOptional()
    @Transform(JsonParse)
    originCoordinates: object;

    @IsOptional()
    destinationAddress: string;

    @IsOptional()
    @Transform(JsonParse)
    destinationCoordinates: object;

    @IsOptional()
    type: string;

    @IsOptional()
    packages: number;

    @IsOptional()
    passengers: number;

    @IsOptional()
    bags: number;

    @IsOptional()
    weight: string;

    @IsOptional()
    idVehicle: number | null;

    @IsOptional()
    distance: string;

    @IsOptional()
    duration: string;

    @IsOptional()
    weightUnit: number;
    
    @Transform(JsonParse)
    @IsOptional()
    images: string[];
}
