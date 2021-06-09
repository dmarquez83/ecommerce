import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { CreateTicketDto } from './dto/createTicket.dto';
import { UpdateTicketDto } from './dto/updateTicket.dto';
import { TicketsService } from './tickets.service';

@UsePipes(new TrimPipe())
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {

    constructor(private readonly ticketsService: TicketsService) {}

    /**
     * Find all the tickets
     */
    @Get('')
    findAll() {
        return this.ticketsService.findAll();
    }

    /**
     * Find a ticket by its id
     * @param id ticket id
     */
    @Get(':id')
    findById(@Param('id') id: number) {
        return this.ticketsService.findById(id);
    }

    /**
     * Disable a ticket by its id
     * @param id ticket id
     * @param user logged user extracted from token
     */
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.ticketsService.disable(id, user);
    }

    /**
     * Create a ticket
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Post('')
    create(@Body() body: CreateTicketDto, @UserDec() user: IUserReq) {
        return this.ticketsService.create(body, user);
    }

    /**
     * Modify a ticket
     * @param id ticket id
     * @param body data to update
     * @param user logged user extracted from token
     */
    @Put(':id')
    update(@Param('id') id: number, @Body() body: UpdateTicketDto, @UserDec() user: IUserReq) {
        return this.ticketsService.update(id, body, user);
    }

}
