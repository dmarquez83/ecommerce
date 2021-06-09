import { IsEmpty, IsOptional } from 'class-validator';

export class UpdateBankDto {
    @IsOptional()
    name: string;
    
    @IsOptional()
    code: string;

    @IsEmpty()
    modificationDate?: Date;

}
