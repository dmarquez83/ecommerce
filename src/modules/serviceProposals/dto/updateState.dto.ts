import { IsOptional } from 'class-validator';

export class UpdateServiceProposalDTO {
   
    @IsOptional()
    idService: number;

    @IsOptional()
    price: number;

    @IsOptional()
    idVehicle: number;
}
