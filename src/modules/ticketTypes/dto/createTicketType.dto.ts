import { IsNotEmpty } from 'class-validator';

export class CreateTicketTypeDto {

    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
}
