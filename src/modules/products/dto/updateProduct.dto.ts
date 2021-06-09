import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, Validate, ValidateIf } from 'class-validator';
import { CheckCharacteristicUnitInProperties, IsGreaterThan, 
    LocationValidator, MatchProperties, ProductVariationNameAndType,
    PropertyComboDontMatch } from '../../../common/decorators';
import { JsonParse, StringToBoolean, UniqueTags } from '../../../common/transforms';

export class UpdateProductDto {

    @IsNotEmpty()
    idCategory: number;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    @Transform(JsonParse)
    @Transform(UniqueTags)
    tags: any;

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

    @IsGreaterThan(-0.000000000000000001, {
        message: 'lengthValue can\'t be negative'
    })
    @IsNotEmpty()
    lengthValue: number;

    @IsNotEmpty()
    lengthUnit: number;

    @IsGreaterThan(-0.000000000000000001, {
        message: 'widthValue can\'t be negative'
    })
    @IsNotEmpty()
    widthValue: number;

    @IsNotEmpty()
    widthUnit: number;

    @IsGreaterThan(-0.00000000000000001, {
        message: 'weightValue can\'t be negative'
    })
    @IsNotEmpty()
    weightValue: string;

    @IsNotEmpty()
    weightUnit: number;

    @IsNotEmpty()
    isNew: boolean;

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
