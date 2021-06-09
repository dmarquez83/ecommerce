
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserDec } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { IResponseStructureReturn } from '../../common/interfaces';
import { devicesResponses } from '../../common/responses/devices.response';
import { MessageDto } from '../../modules/messages/dto/message.dto';
import { MessagesService } from '../../modules/messages/messages.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { IDevice } from './interfaces/device.interface';

@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DeviceController {
    constructor(private readonly devicesService: DevicesService,
                private readonly messagesService: MessagesService) { }

    @Get()
    async getDevices(): Promise<IResponseStructureReturn> {
        return await this.devicesService.getDevices(devicesResponses.list);
    }

    @Post()
    async createDevice(@Body() data: CreateDeviceDto,
                       @UserDec() user: IUserReq): Promise<any> {

        return await this.devicesService.saveDevice({ ...data, idUser: user.userId }, user,
            devicesResponses.creation);
    }

    @Post('/:projectId/:token/messages')
    async sendNotification(@Param('projectId') projectId: string, @Param('token') token: string,
                           @Body() message: MessageDto): Promise<string | undefined> {
        const device: IDevice = await this.devicesService.getDevice(token);

        const fcmToken: string = device.token;

        return await this.messagesService.sendNotification(projectId, fcmToken, message);
    }
}
