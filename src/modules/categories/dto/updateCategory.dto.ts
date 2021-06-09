import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoryDto {

    @IsOptional()
    idParent: number | null;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    type: string;

    @IsOptional()
    description: string | null;

}
