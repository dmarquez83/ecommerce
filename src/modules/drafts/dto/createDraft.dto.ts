import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { JsonParse } from '../../../common/transforms';

export class CreateDraftDto {

    id: string;

    @IsNotEmpty()
    @Transform(JsonParse)
    data: string;
  
    @IsNotEmpty()
    type: JSON;
}
