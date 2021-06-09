import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, Validate, ValidateIf } from 'class-validator';
import { CheckCharacteristicUnitInProperties, IsGreaterThan, 
    LocationValidator, MatchProperties, ProductVariationNameAndType,
    PropertyComboDontMatch } from '../../../common/decorators';
import { JsonParse, StringToBoolean, UniqueTags } from '../../../common/transforms';

export class CreateProductDto {

    @IsNotEmpty()
    idBusiness: number;

    @IsNotEmpty()
    idCategory: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    sku: string | null;

    @Validate(CheckCharacteristicUnitInProperties)
    @MatchProperties({
        message: 'There is a repeated property in properties object'
    })
    @Transform(JsonParse)
    @IsOptional()
    properties: object;

    @IsOptional()
    brand: string;

    @Transform(JsonParse)
    @IsOptional()
    images: string[];

    @Transform(UniqueTags)
    @Transform(JsonParse)
    @IsOptional()
    tags: any;

    @IsOptional()
    @IsGreaterThan(-0.000000000000000001, {
        message: 'lengthValue can\'t be negative'
    })
    lengthValue: number;

    @IsNotEmpty()
    lengthUnit: number;

    @IsNotEmpty()
    @IsGreaterThan(-0.000000000000000001, {
        message: 'widthValue can\'t be negative'
    })
    widthValue: number;

    @IsNotEmpty()
    widthUnit: number;

    @IsNotEmpty()
    @IsGreaterThan(-0.00000000000000001, {
        message: 'weightValue can\'t be negative'
    })
    weightValue: string;

    @IsNotEmpty()
    weightUnit: number;

    @IsNotEmpty()
    isNew: boolean;

    @IsOptional()
    creationDate: Date;

    @IsNotEmpty()
    @Transform(StringToBoolean)
    isVariant: boolean;

    @ValidateIf(o => o.isVariant)
    @PropertyComboDontMatch()
    @ProductVariationNameAndType()
    @Validate(LocationValidator)
    @Validate(CheckCharacteristicUnitInProperties)
    @MatchProperties({
        message: 'There is a repeated property in variations.properties object'
    })
    @Transform(JsonParse)
    @IsNotEmpty()
    variations: any;

    @ValidateIf(o => !o.isVariant)
    @Validate(LocationValidator)
    @Transform(JsonParse)
    @IsNotEmpty()
    locations: any[];
}
