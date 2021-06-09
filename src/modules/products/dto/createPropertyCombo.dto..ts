import { IsNotEmpty} from 'class-validator';

export class CreatePropertyComboDto {

    @IsNotEmpty()
    idProperty: number;

    @IsNotEmpty()
    idCharacteristic: number;

}
