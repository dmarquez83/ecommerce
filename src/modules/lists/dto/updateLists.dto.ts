import { Transform } from 'class-transformer';
import { IsEmpty, IsOptional } from 'class-validator';
import { JsonParse } from '../../../common/transforms/JsonParse.transform';
import { StringToBoolean } from '../../../common/transforms/StringBoolean.transform';
import { IListOptions } from '../interfaces/options.interface';

export class UpdateListDto {
    
    @IsOptional()
    name: string;
    
    @IsOptional()
    @Transform(StringToBoolean)
    measure: boolean;
    
    @IsOptional()
    @Transform(StringToBoolean)
    editable: boolean;
    
    @IsOptional()
    @Transform(JsonParse)
    options: IListOptions[];

    @IsEmpty()
    modificationDate: Date;
}
