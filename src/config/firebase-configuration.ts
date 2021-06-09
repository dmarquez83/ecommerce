import { ConfigService } from '@nestjs/config';
import { IFirebaseProjectsConfig } from '../common/interfaces';

const serviceAccount = require('../../lo.json');

export class FirebaseConfig {

    readonly messagingConfiguration: IFirebaseProjectsConfig = {
            projects: [
                // Array with all settings for each
                {
                    id: 'pynpon',
                    serverKey: this.configService.get('FIREBASE_SERVE_KEY'),
                    databaseURL: this.configService.get('FIREBASE_DATABASE'),
                    serviceAccount
                }
            ]
    };
    
    constructor(private readonly configService: ConfigService) {}
}
