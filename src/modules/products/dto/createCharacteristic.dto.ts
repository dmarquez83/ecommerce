import { IsAlphanumeric, IsNotEmpty, IsOptional} from 'class-validator';

export class CreateCharacteristicDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    label: string;

    @IsNotEmpty()
    dataType: string;

    @IsOptional()
    unitRequired: boolean;

    @IsOptional()
    idList: number;

    @IsOptional()
    system: boolean;

}
