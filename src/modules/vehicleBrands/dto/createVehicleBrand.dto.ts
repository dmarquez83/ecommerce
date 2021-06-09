import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVehicleBrandDto {

    @IsOptional()
    imgCode: string;

    @IsNotEmpty()
    name: string;
}
