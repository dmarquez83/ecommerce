import { IsNotEmpty } from 'class-validator';

export class CreateStateDto {
   
    @IsNotEmpty()
    name: string;

}
