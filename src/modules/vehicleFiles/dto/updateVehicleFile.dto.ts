import { IsNotEmpty } from 'class-validator';

export class UpdateVehicleFileDto {

    @IsNotEmpty()
    imgCode: string[];

    @IsNotEmpty()
    idVehicle: number;
}
