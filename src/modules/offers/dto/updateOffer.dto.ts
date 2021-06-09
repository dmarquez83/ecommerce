import { IsJSON, IsOptional, IsString } from 'class-validator';
import { IsGreaterThan } from '../../../common/decorators/isGreaterThanValidation.decorator';

export class UpdateOfferDto {
    
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    type: string;

    @IsGreaterThan(0, {message: 'Price can\'t be 0 or negative'})
    @IsOptional()
    price: number;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsJSON()
    properties: object | null;
    
    @IsOptional()
    @IsJSON()
    images: object | null;
  
}
