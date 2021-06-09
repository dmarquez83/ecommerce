import { IsNotEmpty } from 'class-validator';
export class CreateMunicipalityDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    idState: number;
}
