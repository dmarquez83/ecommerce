import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { credential, initializeApp, messaging } from 'firebase-admin';
import { FirebaseConfig } from '../../../config/firebase-configuration';
import { IProjectConfiguration, IProjectData } from './firebase.type';

@Injectable()
export class FireBase {

    // map of all data of each client project
    private _projectItems = new Map<string, IProjectData>();

    constructor(private readonly configService: ConfigService) {} 

    /**
     * Configure and initialize configuration of all projects with firebase
     */
    configure(): void {
        this.projects().forEach(project => {
            const ref = initializeApp({
                credential: credential.cert(project.serviceAccount),
                databaseURL: project.databaseURL,
            });
            const appData = { id: project.id, ref, serverKey: project.serverKey } as IProjectData;
            this._projectItems.set(appData.id, appData);
        });
    }

    /**
     * Get all data of project by id
     * @param projectId project id
     */
    getProjectData(projectId: string): IProjectData {
        const data = this._projectItems.get(projectId);
        
        if (!data) {
            throw new InternalServerErrorException('Project not found');
        }

        return data;
    }

    /**
     * Send notificatión to specific token
     * @param projectId id of the client to send the notification
     * @param token token device
     * @param notification notification message
     */
    async sendNotification(projectId: string, token: string, notification: any):
        Promise<string | undefined> {
            const project = this.getProjectData(projectId);
            const data = { ...notification, token };
            
            return await messaging(project.ref).send(data)
                .catch(() => {
                    throw new InternalServerErrorException('Error sending notification, can be an error in token');
                });
    }

    /**
     * Set all project in the firebase configurations
     */
    private projects(): IProjectConfiguration[] {
        // generate new instance of firebaseConfig to get all current client projects
        const messagingConfiguration = new FirebaseConfig(this.configService).messagingConfiguration;
        
        return messagingConfiguration.projects as IProjectConfiguration[];
    }
}
