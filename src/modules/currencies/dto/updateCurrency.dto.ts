import { IsEmpty, IsOptional } from 'class-validator';
export class UpdateCurrencyDto {

    @IsOptional()
    code: string;
  
    @IsOptional()
    name: string;
  
    @IsOptional()
    value: number;
  
    @IsOptional()
    isVolatile: boolean;
  
    @IsEmpty()
    modificationDate: Date;
}
