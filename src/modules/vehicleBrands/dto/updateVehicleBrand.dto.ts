import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateVehicleBrandDto {

    @IsOptional()
    imgCode: string;

    @IsNotEmpty()
    name: string;
}
