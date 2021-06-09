import { User } from '../../../models';

export interface ILogin {
    token: string;
    refreshToken: string;
    user: User;
}
