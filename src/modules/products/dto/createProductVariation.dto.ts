import { IsNotEmpty } from 'class-validator';

export class ProductVariationDto {

    @IsNotEmpty()
    idProduct: number;

    @IsNotEmpty()
    variations: number[];

    @IsNotEmpty()
    sku: string;

    @IsNotEmpty()
    status: string;
}
