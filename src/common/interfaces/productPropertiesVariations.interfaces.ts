import { ILocation } from './locations.interface';
import { IVariations } from './properties.interfaces';

export interface IPropertiesVariation {
    variation: IVariations[];
    sku: string;
    images?: string[];
    locations: ILocation[];
}
