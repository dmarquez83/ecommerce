import { IsEmpty, IsOptional } from 'class-validator';

export class UpdateBankAccountDto {
    @IsOptional()
    account: string;

    @IsOptional()
    name: string;

    @IsOptional()
    identityDocument: string;

    @IsOptional()
    idBank: number;

    @IsOptional()
    idWallet: number;

    @IsEmpty()
    modificationDate?: Date;
}
