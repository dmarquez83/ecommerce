import { IsIn, IsNotEmpty } from 'class-validator';
import { CategoryType } from '../../../common/enum/categoryType.enum';

export class TypeDto {
    @IsNotEmpty()
    @IsIn([CategoryType.PRODUCT, CategoryType.RENT, CategoryType.SERVICE])
    type: string;
}
