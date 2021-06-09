import { IsNotEmpty } from 'class-validator';

export class DisableProductPropVariation {

    @IsNotEmpty()
    idProduct: number;

    @IsNotEmpty()
    property: string;

    @IsNotEmpty()
    variation: string;

    @IsNotEmpty()
    disabled: boolean;

    @IsNotEmpty()
    creationUser: number;

}