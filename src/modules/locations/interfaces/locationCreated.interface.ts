import { Location } from '../../../models/location.entity';

export interface ILocationCreated {
    location?: Location;
    code: number;
    message: string;
    status: boolean;
    err?: any;
}
