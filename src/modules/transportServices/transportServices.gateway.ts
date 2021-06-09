import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { UserDec } from '../../common/decorators/user.decorator';
import { CastHttpExceptionToWsException } from '../../common/filters/castHttpExceptionToWsException.filter';
import { WsJwtGuard } from '../../common/guards/wsJwt.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { tsResponses } from '../../common/responses/transportServices.responses';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateTransportServiceDto } from './dto/createTransportService.dto';
import { UpdateTransportServiceDto } from './dto/updateTransportService.dto';
import { TransportServicesService } from './transportServices.service';

@WebSocketGateway(3001, { namespace: 'services' })
export class TransportServicesGateway {

    constructor(
        private readonly transportServicesService: TransportServicesService
    ) {}

    @UseFilters(new CastHttpExceptionToWsException())
    @SubscribeMessage('create')
    @UseGuards(WsJwtGuard)
    @UsePipes(new ValidationPipe())
    async create(@MessageBody() data: CreateTransportServiceDto, @UserDec() user: IUserReq): Promise<any> {
        return this.transportServicesService.create(data, user, tsResponses.create);
    }

    @UseFilters(new CastHttpExceptionToWsException())
    @SubscribeMessage('update')
    @UseGuards(WsJwtGuard)
    @UsePipes(new ValidationPipe())
    async update(@MessageBody() data: UpdateTransportServiceDto, @UserDec() user: IUserReq): Promise<any> {
        return this.transportServicesService.update(data.id, data, user, tsResponses.update);
    }

    @UseFilters(new CastHttpExceptionToWsException())
    @SubscribeMessage('cancel')
    @UseGuards(WsJwtGuard)
    @UsePipes(new ValidationPipe())
    async cancel(@MessageBody() id: number, @UserDec() user: IUserReq): Promise<any> {
        return this.transportServicesService.cancel(id, user, tsResponses.cancel);
    }

    @UseFilters(new CastHttpExceptionToWsException())
    @SubscribeMessage('get')
    @UseGuards(WsJwtGuard)
    @UsePipes(new ValidationPipe())
    async getById(@MessageBody() id: number, @UserDec() user: IUserReq): Promise<any> {
        return this.transportServicesService.findById(id, user);
    }

    @UseFilters(new CastHttpExceptionToWsException())
    @SubscribeMessage('get-all')
    @UseGuards(WsJwtGuard)
    @UsePipes(new ValidationPipe())
    async getAll(): Promise<any> {
        return this.transportServicesService.findAll(tsResponses.list);
    }
}
