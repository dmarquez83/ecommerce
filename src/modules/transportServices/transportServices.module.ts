import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProposal, TransportService } from '../../models';
import { ServiceFilesModule } from '../serviceFiles/serviceFiles.module';
import { TransportServicesController } from './transportServices.controller';
import { TransportServicesGateway } from './transportServices.gateway';
import { TransportServicesService } from './transportServices.service';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceProposal, TransportService]), ServiceFilesModule],
    providers: [TransportServicesService, TransportServicesGateway],
    controllers: [TransportServicesController],
    exports: [TransportServicesService]
})
export class TransportServicesModule {}
