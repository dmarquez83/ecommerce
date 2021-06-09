import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateCurrencyDto {

    @IsNotEmpty()
    code: string;
  
    @IsNotEmpty()
    name: string;
  
    @IsNotEmpty()
    value: number;
  
    @IsNotEmpty()
    isVolatile: boolean;
  
    @IsEmpty()
    creationDate?: Date;
}
