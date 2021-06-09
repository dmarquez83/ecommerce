import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { IResponseStructureReturn } from '../../common/interfaces';
import { devicesResponses } from '../../common/responses/devices.response';
import { BasicService } from '../../common/services';
import { Device } from '../../models';
import { MessageDto } from '../messages/dto/message.dto';
import { MessagesService } from '../messages/messages.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { IDevice } from './interfaces/device.interface';

@Injectable()
@EntityRepository(Device)
export class DevicesService extends BasicService<Device> {

    constructor(@InjectRepository(Device)
                private readonly deviceRepository: Repository<Device>,
                private readonly _messagesService: MessagesService
    ) {
        super(deviceRepository);
    }

    /**
     * Get device by token
     * @param token token to find
     */
    async getDevice(token: string): Promise<any> {
        return await this.findOneWithOptionsOrFail({
            where: { token }
        }).catch(() => {
            throw new ForbiddenException(devicesResponses.list.error);
        });
    }

    /**
     * Get device by idUser
     * @param idUser idUser to find
     */
    async getDeviceByIdUser(idUser: number): Promise<any> {
        return await this.findWithOptionsOrFail({
            where: { idUser }
        }).catch(() => {
            throw new ForbiddenException(devicesResponses.list.error);
        });
    }

    /**
     * Get all devices conected
     */
    async getDevices(response: any): Promise<IResponseStructureReturn> {
        const result = await this.getAll()
            .catch(() => {
                throw new ForbiddenException(response.error);
            });

        return this.formatReturn(response.success, 'devices', result);
    }

    /**
     * Save the device to notifications
     * @param data Data to save device
     * @param user Loggued user
     */
    async saveDevice(data: IDevice, user: IUserReq, response: any): Promise<any> {
        const device = await this.save(data, user)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });

        return this.formatReturn(response.success, 'device', device);
    }

    /**
     * Delete device to notifications
     * @param token token to delete
     */
    async deleteDevice(token: string): Promise<any> {
        const device = await this.findOneWithOptionsOrFail({
            where: { token }
        }).catch(() => {
            throw new InternalServerErrorException(devicesResponses.list.noPermission);
        });

        return await this.deleteEntity(device);
    }

    /**
     * Send notification push to devices
     * @param message Message with structure push
     * @param idUser IdUser to send notification to devices registers
     */
    async sendNotificationPush(message: MessageDto, idUser: number):
        Promise<void> {
        const devices: IDevice[] = await this.getDeviceByIdUser(idUser);

        for (const device of devices) {
            const fcmToken: string = device.token;

            await this._messagesService.sendNotification(device.idProject, fcmToken, message);
        }
    }
}
