import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { Response, Roles, UserDec } from '../../common/decorators/';
import { tsPermission } from '../../common/enum/transportServicePermission.enum';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { tsResponses } from '../../common/responses/transportServices.responses';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateTransportServiceDto } from './dto/createTransportService.dto';
import { UpdateTransportServiceDto } from './dto/updateTransportService.dto';
import { TransportServicesGuard} from './guards/transportServices.guard';
import { TransportServicesService } from './transportServices.service';

@UseGuards(JwtAuthGuard, TransportServicesGuard)
@UsePipes(new TrimPipe())
@Controller('services')
export class TransportServicesController {

    constructor(
        private readonly transportServicesService: TransportServicesService
    ) { }

    @UsePipes(new ValidationPipe())
    @Post()
    create(@Body() body: CreateTransportServiceDto, @UserDec() user: IUserReq) {
        return this.transportServicesService.create(body, user, tsResponses.create);
    }

    @Roles(tsPermission.UPDATE)
    @Response(tsResponses.update)
    @UsePipes(new ValidationPipe())
    @Put('/:id')
    update(@Param('id') id: number, @Body() body: UpdateTransportServiceDto, @UserDec() user: IUserReq) {
        return this.transportServicesService.update(id, body, user, tsResponses.update);
    }

    @Roles(tsPermission.CANCEL)
    @Response(tsResponses.cancel)
    @Put('/:id/cancel')
    cancel(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.transportServicesService.cancel(id, user, tsResponses.cancel);
    }

    @Roles(tsPermission.PICKUP)
    @Response(tsResponses.setPickedUp)
    @Put('/:id/pickedUp')
    setPickedUp(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.transportServicesService.setPickedUp(id, user, tsResponses.setPickedUp);
    }

    @Roles(tsPermission.cPICKED)
    @Response(tsResponses.confirmPickedUp)
    @Put('/:id/confirmPickedUp')
    confirmPickedUp(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.transportServicesService.confirmPickedUp(id, user, tsResponses.confirmPickedUp);
    }

    @Roles(tsPermission.DELIVERY)
    @Response(tsResponses.delivered)
    @Put('/:id/delivered')
    setDelivered(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.transportServicesService.setDelivered(id, user, tsResponses.delivered);
    }

    @Roles(tsPermission.COMPLETE)
    @Response(tsResponses.complete)
    @Put('/:id/complete')
    complete(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.transportServicesService.complete(id, user, tsResponses.complete);
    }

    @Roles(tsPermission.DELETE)
    @Response(tsResponses.delete)
    @Delete('/:id')
    delete(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.transportServicesService.delete(id, user, tsResponses.delete);
    }

    @UsePipes(new ValidationPipe())
    @Get('user/active')
    findActiveServicesByUser(@UserDec() user: IUserReq) {
        return this.transportServicesService.findActiveServicesByUser(user, tsResponses.list);
    }

    @UsePipes(new ValidationPipe())
    @Get('user/historical')
    findHistoricalServicesByUser(@UserDec() user: IUserReq) {
        return this.transportServicesService.findHistoricalServicesByUser(user, tsResponses.list);
    }

    @UsePipes(new ValidationPipe())
    @Get('driver/available')
    findAvailableServicesByDriver(@UserDec() user: IUserReq) {
        return this.transportServicesService.findAvailableServicesByDriver(user, tsResponses.list);
    }

    @UsePipes(new ValidationPipe())
    @Get('driver/active')
    findActiveServicesByDriver(@UserDec() user: IUserReq) {
        return this.transportServicesService.findActiveServicesByDriver(user, tsResponses.list);
    }

    @UsePipes(new ValidationPipe())
    @Get(':id')
    getById(@Param('id') id: number) {
        return this.transportServicesService.findById(id, tsResponses.list);
    }

    @UsePipes(new ValidationPipe())
    @Get()
    getAll() {
        return this.transportServicesService.findAll(tsResponses.list);
    }
}
