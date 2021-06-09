import { IsNotEmpty, IsOptional } from 'class-validator';

export class ShippingCompanyCreateDto {

    @IsNotEmpty()
    name: string;
  
    @IsNotEmpty()
    icon: string;
  
    @IsOptional()
    description: string | null;
  }
