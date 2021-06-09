import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { CreateTicketTypeDto } from './dto/createTicketType.dto';
import { UpdateTicketTypeDto } from './dto/updateTicketType.dto';
import { TicketTypesService } from './ticketTypes.service';

@UsePipes(new TrimPipe(), new ValidationPipe())
@Controller('ticketTypes')
export class TicketTypesController {

    constructor(private readonly ticketTypesService: TicketTypesService) {}

    /**
     * Find all Ticket Types
     */
    @Get()
    findAll() {
        return this.ticketTypesService.findAll();
    }

    /**
     * Find a Ticket Type by its Id
     */
    @Get(':id')
    findById(@Param('id') id: number) {
        return this.ticketTypesService.findById(id);
    }

    /**
     * Disable a Ticket Type by its Id
     * @param id ticket type id
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.ticketTypesService.disable(id, user);
    }

    /**
     * Create a Ticket Type
     * @param body data to create
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: CreateTicketTypeDto, @UserDec() user: IUserReq) {
        return this.ticketTypesService.create(body, user);
    }

    /**
     * Modify a Ticket Type by its Id
     * @param id ticket type Id
     * @param body data to create
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() body: UpdateTicketTypeDto, @UserDec() user: IUserReq) {
        return this.ticketTypesService.update(id, body, user);
    }

    /**
     * Enable a Ticket Type by its Id
     * @param id ticket type Id
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Put('activate/:id')
    enable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.ticketTypesService.enable(id, user);
    }
}
