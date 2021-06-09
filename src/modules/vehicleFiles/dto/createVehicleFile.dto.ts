import { IsNotEmpty } from 'class-validator';

export class CreateVehicleFileDto {

    @IsNotEmpty()
    imgCode: string[];

    @IsNotEmpty()
    idVehicle: number;
}
