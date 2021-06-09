import { IsNotEmpty } from 'class-validator';

export class CreateDeviceDto {
    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    idProject: string;
}
