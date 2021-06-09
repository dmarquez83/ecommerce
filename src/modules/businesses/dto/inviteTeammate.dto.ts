import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty} from 'class-validator';
import { JsonParse } from '../../../common/transforms/JsonParse.transform';
import { IRoles } from '../interfaces/roles.interface';

export class InviteTeammateDTO {

    @IsNotEmpty()
    @IsEmail()
    mail: string;

    @IsNotEmpty()
    @Transform(JsonParse)
    roles: IRoles[];
}
