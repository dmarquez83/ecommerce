import { Provider } from '../../../common/enum/provider.enum';

export interface IDataProvider {
    username: string;
    mail: string;
    status: string;
    firstName: string;
    lastName: string;
    provider: Provider;
    password: string;
}
