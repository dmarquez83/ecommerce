import { Transform } from 'class-transformer';
import { IsEmpty, IsNotEmpty } from 'class-validator';
import { JsonParse } from '../../../common/transforms/JsonParse.transform';
import { StringToBoolean } from '../../../common/transforms/StringBoolean.transform';
import { IListOptions } from '../interfaces/options.interface';

export class CreateListDto {
    
    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    @Transform(StringToBoolean)
    measure: boolean;
    
    @IsNotEmpty()
    @Transform(StringToBoolean)
    editable: boolean;
    
    @IsNotEmpty()
    @Transform(JsonParse)
    options: IListOptions[];

    @IsEmpty()
    creationDate: Date;
}
