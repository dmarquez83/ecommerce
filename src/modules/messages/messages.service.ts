import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { devicesResponses } from '../../common/responses/devices.response';
import { FireBase } from './core/firebase';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {

    constructor(private readonly _firebase: FireBase) {
        this._firebase.configure();
    }
    
    /**
     * Send notification to device
     * @param projectId project id
     * @param token device token
     * @param notification notification message
     */
    async sendNotification(projectId: string, token: string, notification: MessageDto):
        Promise<string | undefined> {
            return await this._firebase.sendNotification(projectId, token, notification)
                .catch(() => {
                    throw new InternalServerErrorException(devicesResponses.notification.error);
                });
    }


}
