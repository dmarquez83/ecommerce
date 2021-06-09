import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Status } from '../../common/enum/status.enum';
import { ticketTypesResponses } from '../../common/responses/ticketTypes.response';
import { BasicService } from '../../common/services/base.service';
import { TicketTypes } from '../../models';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { CreateTicketTypeDto } from './dto/createTicketType.dto';
import { UpdateTicketTypeDto } from './dto/updateTicketType.dto';

@Injectable()
export class TicketTypesService extends BasicService<TicketTypes> {

    responses = ticketTypesResponses;

    constructor(@InjectRepository(TicketTypes)
        private readonly ticketTypesRepository: Repository<TicketTypes>) {
            super(ticketTypesRepository);
        }

    /**
     * Find all Ticket Types
     */
    async findAll() {
        const response = this.responses.list;

        const ticketTypes = await this.ticketTypesRepository.find({where: [{status: Status.ENABLED}]});

        return this.formatReturn(response.success, 'ticketType(s)', ticketTypes);
    }

    /**
     * Find a Ticket Type by its Id
     */
    async findById(id: number) {
        const response = this.responses.list;
        
        const ticketType = await this.ticketTypesRepository.findOneOrFail(id, {
            where: [{status: Status.ENABLED}]
        }).catch(() => {throw new ForbiddenException(response.noPermission); });

        return this.formatReturn(response.success, 'ticketType', ticketType);
    }

    /**
     * Disable a Ticket Type by its Id
     * @param id ticket type id
     * @param user logged user extracted from token
     */
    async disable(id: number, user: IUserReq) {
        const response = this.responses.disable;

        const ticketType = await this.ticketTypesRepository.findOneOrFail(id, {
            where: [{status: Status.ENABLED}]
        }).catch(() => {throw new ForbiddenException(response.noPermission); });

        await this.disableEntityByStatus(ticketType, user)
            .catch(() => {throw new InternalServerErrorException(response.error); });
        
        return this.formatReturn(response.success, 'ticketType', await this.cleanObjects(ticketType) );
    }

    /**
     * Create a Ticket Type
     * @param body data to create
     * @param user logged user extracted from token
     */
    async create(body: CreateTicketTypeDto, user: IUserReq) {
        const response = this.responses.create;

        await this.checkCodeOrNameExist(body, response.codeAndNameBeUnique);

        const savedTicketType = await this.save(body, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        delete savedTicketType.status;

        return this.formatReturn(response.success, 'ticketType', savedTicketType);
    }

    /**
     * Modify a Ticket Type by its Id
     * @param id ticket type Id
     * @param body data to create
     * @param user logged user extracted from token
     */
    async update(id: number, body: UpdateTicketTypeDto, user: IUserReq) {
        const response = this.responses.update;

        const ticketType = await this.ticketTypesRepository.findOneOrFail(id, {
            where: [{status: Status.ENABLED}]
        }).catch(() => { throw new ForbiddenException(response.noPermission); });

        await this.checkCodeOrNameExist(body, response.codeAndNameBeUnique, id);

        const updatedTicketType = await this.updateEntity(body, ticketType, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'ticketType', updatedTicketType);
    }

    /**
     * Enable a Ticket Type by its Id
     * @param id ticket type Id
     * @param user logged user extracted from token
     */
    async enable(id: number, user: IUserReq) {
        const response = this.responses.enable;

        const ticketType = await this.ticketTypesRepository.findOneOrFail(id, {
            where: [{status: Status.DISABLED}]
        }).catch(() => { throw new ForbiddenException(response.noPermission); });

        ticketType.status = Status.ENABLED;

        await this.activateEntityByStatus(ticketType, user)
            .catch(() => { throw new InternalServerErrorException(response.error); });

        return this.formatReturn(response.success, 'ticketType', await this.cleanObjects(ticketType) );
    }

    /**
     * Check if a ticket type with name or code to create/update exist
     * @param body data to check
     * @param errorResponse error response
     * @param idTicketType ticket type Id
     */
    async checkCodeOrNameExist(body: CreateTicketTypeDto | UpdateTicketTypeDto, errorResponse: any, idTicketType?: number) {
        const [, count] = idTicketType ? 
        await this.ticketTypesRepository.findAndCount({
            where: [{id: Not(idTicketType), code: body.code}, {id: Not(idTicketType), name: body.name}]
        }) : 
        await this.ticketTypesRepository.findAndCount({
            where: [{code: body.code}, {name: body.name}]
        });

        if (count > 0) { throw new NotAcceptableException(errorResponse); }
    }
}
