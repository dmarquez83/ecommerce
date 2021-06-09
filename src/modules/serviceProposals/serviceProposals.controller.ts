import {
    Body, Controller, Get, Param,
    Post, Put, UseGuards, UsePipes
} from '@nestjs/common';
import { Response, Roles, UserDec } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { spResponses } from '../../common/responses/serviceProposals.responses';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateServiceProposalDTO } from './dto/createState.dto';
import { ServiceProposalsGuard } from './guards/serviceProposals.guard';
import { ServiceProposalsService } from './serviceProposals.service';

@UseGuards(JwtAuthGuard, ServiceProposalsGuard)
@UsePipes(new TrimPipe())
@Controller('serviceProposals')
export class ServiceProposalsController {

    constructor(private readonly serviceProposalService: ServiceProposalsService) { }

    /**
     * Find all Service proposals
     */
    @Get()
    async findAll() {
        return await this.serviceProposalService.findAll();
    }

    /**
     * Find service proposal by idService and driver
     * @param idService id of the service to find
     */
    @Roles('UserList', 'DriverList')
    @Response(spResponses.list)
    @Get('service/:idService/driver/:idDriver')
    async findByServiceAndDriver(  @Param('idService') idService: number, 
                                   @Param('idDriver') idDriver: number, 
                                   @UserDec() user: IUserReq) {
        return this.serviceProposalService.findByServiceAndDriver(idService, idDriver);
    }

    /**
     * Find service proposal by idService
     * @param idService id of the service to find
     */
    @Roles('UserList')
    @Response(spResponses.list)
    @Get('service/:idService')
    async findByService(@Param('idService') idService: number, @UserDec() user: IUserReq) {
        return this.serviceProposalService.findByService(idService);
    }

    /**
     * Find service proposal pending by driver
     * @param idService id of the service to find
     */
    @Roles('DriverList')
    @Response(spResponses.list)
    @Get('pending')
    async findPendingProposals(@UserDec() user: IUserReq) {
        return this.serviceProposalService.findPendingProposalsByDriver(user);
    }

    /**
     * Create a Service proposal
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Roles('Create')
    @Response(spResponses.create)
    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() body: CreateServiceProposalDTO, @UserDec() user: IUserReq) {
        return this.serviceProposalService.create(body, user);
    }

    /**
     * Cancel a Service proposal
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Roles('Cancel')
    @Response(spResponses.cancel)
    @Put('service/:idService/driver/:idDriver/cancel')
    @UsePipes(new ValidationPipe())
    async cancel(  @Param('idService') idService: number, 
                   @Param('idDriver') idDriver: number, 
                   @UserDec() user: IUserReq) {
        return this.serviceProposalService.cancel(idService, idDriver, user);
    }

    /**
     * Cancel a Service proposal
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Roles('Decline')
    @Response(spResponses.decline)
    @Put('service/:idService/driver/:idDriver/decline')
    @UsePipes(new ValidationPipe())
    async decline(  @Param('idService') idService: number, 
                    @Param('idDriver') idDriver: number, 
                    @UserDec() user: IUserReq) {
        return this.serviceProposalService.decline(idService, idDriver, user);
    }

    /**
     * Cancel a Service proposal
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Roles('Accept')
    @Response(spResponses.accept)
    @Put('service/:idService/driver/:idDriver/accept')
    @UsePipes(new ValidationPipe())
    async accept(  @Param('idService') idService: number, 
                   @Param('idDriver') idDriver: number, 
                   @UserDec() user: IUserReq) {
        return this.serviceProposalService.accept(idService, idDriver, user);
    }
}
