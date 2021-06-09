import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { ticketsResponses } from '../../common/responses/tickets.response';
import { BasicService } from '../../common/services/base.service';
import { Tickets } from '../../models/ticket.entity';
import { TicketTypesService } from '../ticketTypes/ticketTypes.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateTicketDto } from './dto/createTicket.dto';
import { UpdateTicketDto } from './dto/updateTicket.dto';

@Injectable()
export class TicketsService extends BasicService<Tickets> {

    ticektResponse = ticketsResponses;

    constructor(@InjectRepository(Tickets)
        private readonly ticketRepository: Repository<Tickets>,
                private readonly ticketTypesService: TicketTypesService) {
            super(ticketRepository);
    }

    /**
     *  Clean the ticket object to response
     * @param ticket ticket to clean
     */
    cleanTicketsResponse(ticket: any) {
        ticket.id = Number(ticket.id);
        delete ticket.status;
    } 

    /**
     * Find all the tickets
     */
    async findAll() {
        const response = this.ticektResponse.list;

        const tickets = await this.ticketRepository.find({ where: [{status: Status.ENABLED}], relations: ['ticketType']});

        for (const ticket of tickets) {
            this.cleanTicketsResponse(ticket);
        }

        return this.formatReturn(response.success, 'tickets', tickets);
    }

    /**
     * Find a ticket by its id
     * @param id ticket id
     */
    async findById(id: number) {
        const response = this.ticektResponse.list;

        const ticket = await this.ticketRepository.findOne(id, {where: [{status: Status.ENABLED}], relations: ['ticketType']});

        this.cleanTicketsResponse(ticket);

        return ticket ? this.formatReturn(response.success, 'ticket', ticket) : {};
    }

    /**
     * Disable a ticket by its id
     * @param id ticket id
     * @param user logged user extracted from token
     */
    async disable(id: number, user: IUserReq) {
        const response = this.ticektResponse.disable;

        const ticket = await this.ticketRepository.findOneOrFail(id, {
            where: [{status: Status.ENABLED, creationUser: user.userId}],
            relations: ['ticketType', 'creationUser']
        }).catch(() => { throw new ForbiddenException(response.noPermission); });
        
        if (ticket.creationUser.id !== user.userId) { throw new NotAcceptableException(response.NotOwner); }

        await this.disableEntityByStatus(ticket, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        this.cleanTicketsResponse(ticket);

        return this.formatReturn(response.success, 'ticket', await this.cleanObjects(ticket) );
    }

    /**
     * Create a ticket
     * @param body data to create
     * @param user logged user extracted from token
     */
    async create(body: CreateTicketDto, user: IUserReq) {
        const response = this.ticektResponse.create;

        await this.checkTicketType(body.idTicketType, response.noPermission);

        const savedTicket = await this.saveAndGetRelations(body, user, ['ticketType'])
            .catch(() => { throw new InternalServerErrorException(response.error); });

        this.cleanTicketsResponse(savedTicket);

        return this.formatReturn(response.success, 'ticket', savedTicket);
    }

    /**
     * Modify a ticket
     * @param body data to update
     * @param user logged user extracted from token
     */
    async update(id: number, body: UpdateTicketDto, user: IUserReq) {
        const response = this.ticektResponse.modify;

        if (body.idTicketType) {await this.checkTicketType(body.idTicketType, response.noPermission); }

        const ticket = await this.ticketRepository.findOneOrFail(id, {
            where: [{status: Status.ENABLED}]
        }).catch(() => { throw new ForbiddenException(response.noPermission); });

        const updatedTicket = await this.updateAndGetRelations(body, ticket, user, ['ticketType'])
            .catch(() => { throw new InternalServerErrorException(response.error); });

        this.cleanTicketsResponse(updatedTicket);

        return this.formatReturn(response.success, 'ticket', updatedTicket);
    }

    /**
     * Check if the ticket type exist
     * @param id ticket type Id
     * @param errorResponse errorResponse in case tickewt type doesn't exist
     */
    async checkTicketType(id: number, errorResponse: any) {
        const ticketType = await this.ticketTypesService.findOneWithOptions({where: [{id, status: Status.ENABLED}]});
        
        if (!ticketType) {throw new ForbiddenException(errorResponse); }
    }
}
