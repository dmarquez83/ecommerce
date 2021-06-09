import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { JsonParse } from '../../../common/transforms/JsonParse.transform';
import { StringToBoolean } from '../../../common/transforms/StringBoolean.transform';

export class UpdateStockDto {

    @IsNotEmpty()
    idProduct: number;

    @IsNotEmpty()
    @Transform(StringToBoolean)
    isVariant: boolean;

    @IsNotEmpty()
    @Transform(JsonParse)
    locations: any;

}
