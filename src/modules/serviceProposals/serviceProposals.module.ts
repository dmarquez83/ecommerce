import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProposal, TransportService } from '../../models';
import { DevicesModule } from '../devices/devices.module';
import { TransportServicesModule } from '../transportServices/transportServices.module';
import { ServiceProposalsController } from './serviceProposals.controller';
import { ServiceProposalsService } from './serviceProposals.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceProposal,
      TransportService]),
    TransportServicesModule,
    DevicesModule
  ],
  providers: [ServiceProposalsService],
  controllers: [ServiceProposalsController]
})
export class ServiceProposalsModule {}
