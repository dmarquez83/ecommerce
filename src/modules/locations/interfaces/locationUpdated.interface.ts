import { Location } from '../../../models/location.entity';

export interface ILocationUpdated {
    location?: Location;
    code: number;
    message: string;
    status: boolean;
    err?: any;
}
