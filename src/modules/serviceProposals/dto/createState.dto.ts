import { IsNotEmpty } from 'class-validator';

export class CreateServiceProposalDTO {
   
    @IsNotEmpty()
    idService: number;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    idVehicle: number;
}
