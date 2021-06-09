import { IsNotEmpty} from 'class-validator';

export class CreatePropertyCharacteristicDto {

    @IsNotEmpty()
    idProperty: number;

    @IsNotEmpty()
    idCharacteristic: number;

}
