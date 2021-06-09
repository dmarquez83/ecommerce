import { Product } from '../../../models/';

export interface IProductCreated {
    product?: Product;
    code: number;
    message: string;
    status: boolean;
    err?: any;
}
