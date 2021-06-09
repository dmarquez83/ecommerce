import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateTicketDto {
    
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    idTicketType: number;
  
    @IsOptional()
    subject: string;
  
    @IsOptional()
    description: string;
}
