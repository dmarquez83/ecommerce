import { IsDate, IsOptional } from 'class-validator';
import { User } from '../../../models/user.entity';

export class CreateWalletDto {
    @IsOptional()
    balance: number;
    
    @IsOptional()
    @IsDate()
    creationDate: Date;
    
    @IsOptional()
    @IsDate()
    modificationDate: Date | null;
    
    @IsOptional()
    creationUser: User;
    
    @IsOptional()
    modificationUser: User;

    @IsOptional()
    code: string;
  
}
