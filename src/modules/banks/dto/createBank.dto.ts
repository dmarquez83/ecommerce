import { IsNotEmpty, IsEmpty } from 'class-validator';

export class CreateBankDto {
    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    code: string;

}
