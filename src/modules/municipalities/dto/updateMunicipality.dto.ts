import { IsNotEmpty } from 'class-validator';

export class UpdateMunicipalityDto {

    @IsNotEmpty()
    name: string;

}
