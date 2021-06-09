import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
    
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idTicketType: number;
  
    @IsNotEmpty()
    subject: string;
  
    @IsNotEmpty()
    description: string;
}
