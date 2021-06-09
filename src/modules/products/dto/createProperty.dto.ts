import { Transform } from 'class-transformer';
import { IsNotEmpty} from 'class-validator';
import { ICharacteristic } from '../../../common/interfaces/characteristic.interface';

export class CreatePropertyDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    characteristics: ICharacteristic[][];

}
