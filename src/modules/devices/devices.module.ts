import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../../models';
import { MessagesModule } from '../messages/messages.module';
import { DeviceController } from './devices.controller';
import { DevicesService } from './devices.service';

@Module({
    imports: [TypeOrmModule.forFeature([Device]), MessagesModule],
    providers: [DevicesService],
    controllers: [DeviceController],
    exports: [DevicesService]
})
export class DevicesModule { }
