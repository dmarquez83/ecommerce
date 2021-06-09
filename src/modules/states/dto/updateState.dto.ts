import { IsEmpty, IsOptional } from 'class-validator';
export class UpdateStateDto {
   
    @IsOptional()
    name: string;
    
    @IsEmpty()
    modificationDate?: Date;
}
