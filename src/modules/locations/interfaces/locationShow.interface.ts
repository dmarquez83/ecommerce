import { Location } from '../../../models/location.entity';

export interface ILocationShow {
    location?: Location;
    code: number;
    message?: string;
    status: boolean;
}
