import { IsNotEmpty } from 'class-validator';

export class CreateBankAccountDto {
    
    @IsNotEmpty()
    account: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    identityDocument: string;

    @IsNotEmpty()
    idBank: number;

    @IsNotEmpty()
    idWallet: number;
}
