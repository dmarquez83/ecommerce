import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from '../../models/ticket.entity';
import { TicketTypesModule } from '../ticketTypes/ticketTypes.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tickets]), TicketTypesModule],
  providers: [TicketsService],
  controllers: [TicketsController]
})
export class TicketsModule {}
