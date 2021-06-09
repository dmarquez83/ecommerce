import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { JsonParse } from '../../../common/transforms/JsonParse.transform';
import { IRoles } from '../interfaces/roles.interface';

export class AssignRoleDto {

    @IsNotEmpty()
    @Transform(JsonParse)
    roles: IRoles[];
}
