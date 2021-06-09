import { IsEmpty, IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsGreaterThan } from '../../../common/decorators/isGreaterThanValidation.decorator';

export class CreateOfferDto {

    @IsNotEmpty()
    idBusiness: number;
    
    @IsNotEmpty()
    idCategory: number;
    
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsEmpty()
    status: string;

    @IsNotEmpty()
    type: string;

    @IsGreaterThan(0, {message: 'Price can\'t be 0 or negative'})
    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsJSON()
    properties: object | null;
    
    @IsOptional()
    @IsJSON()
    images: object | null;
    
    @IsEmpty()
    creationDate: Date;
}
