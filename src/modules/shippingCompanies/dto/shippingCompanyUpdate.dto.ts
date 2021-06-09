import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class ShippingCompanyUpdateDto {

    @IsOptional()
    name: string;
  
    @IsOptional()
    icon: string;
  
    @IsOptional()
    description: string | null;

    @IsEmpty()
    creationDate?: Date;

    @IsEmpty()
    modificationDate?: Date;

  }
