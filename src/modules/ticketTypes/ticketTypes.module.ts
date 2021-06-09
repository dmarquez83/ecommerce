import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketTypes } from '../../models';
import { TicketTypesController } from './ticketTypes.controller';
import { TicketTypesService } from './ticketTypes.service';

@Module({
    imports: [TypeOrmModule.forFeature([TicketTypes])],
    controllers: [TicketTypesController],
    providers: [TicketTypesService],
    exports: [TicketTypesService]
})
export class TicketTypesModule {}
