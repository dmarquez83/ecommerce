import { IsEmpty, IsOptional } from 'class-validator';
export class UpdateTicketTypeDto {

    @IsOptional()
    code: string;

    @IsOptional()
    name: string;

    @IsOptional()
    description: string;

    @IsEmpty()
    modificationDate?: Date; 
}
