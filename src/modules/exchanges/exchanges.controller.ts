import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateExchangeDto } from './dto/createExchange.dto';
import { ExchangesService } from './exchanges.service';

@Controller('exchanges')
export class ExchangesController {

    constructor(private readonly exchangesService: ExchangesService) {}

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: CreateExchangeDto, @UserDec() user: IUserReq) {
        return this.exchangesService.create(body, user);
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') idExchange: number, @Body() body: CreateExchangeDto, @UserDec() user: IUserReq) {
        return this.exchangesService.update(idExchange, body, user);
    }

    /**
     * Find all exchanges that belong to logged user
     * 
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    list(@UserDec() user: IUserReq) {
        return this.exchangesService.list(user);
    }

    /**
     * Disable a exchange
     * 
     * @param id exchange id that is going to be disabled
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.exchangesService.disable(id, user);
    }

    /**
     * Enable an exchange by its id
     * 
     * @param id exchange id that is going to be enabled
     * @param user logged user extracted from token
     */
    @UseGuards(JwtAuthGuard)
    @Put('activate/:id')
    activate(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.exchangesService.activate(id, user);
    }
}
