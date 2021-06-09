import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserDec } from '../../common/decorators/user.decorator';
import { LocationPermission } from '../../common/enum/locationPermission.enum';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { locationResponses } from '../../common/responses/locations.response';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateLocationDto } from './dto/createLocation.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { LocationsRolesGuard } from './guard/locationRoles.guard';
import { LocationsService } from './locations.service';

@UseGuards(JwtAuthGuard, LocationsRolesGuard)
@UsePipes(new TrimPipe())
@Controller('locations')
export class LocationsController {

    constructor(
        private readonly locationService: LocationsService
    ) { }
    @Roles(LocationPermission.LIST)
    @Get(':id')
    async show(@Param('id') id: number) {
        return this.locationService.show(id, locationResponses.list);
    }

    /**
     * Creates a new Location
     * @param data: Location data required to create 
     * @returns the new location created
     */
    @UsePipes(new ValidationPipe())
    @Roles(LocationPermission.CREATE)
    @Post()
    create(@Body() data: CreateLocationDto, @UserDec() user: IUserReq) {
        return this.locationService.create(data, user, locationResponses.creation);
    }

    /**
     * Responsible for listing companies.
     * @param page Page you wish to consult.
     * @param limit Item per page.
     * @param order Order "ASC" | "DESC"
     * @param orderBy Field to order
     */
    @Roles(LocationPermission.LIST)
    @Get('business/:id')
    async byBusiness(   @Param('id') id: number, 
                        @Query('page') page: number,
                        @Query('limit') limit: number,
                        @Query('order') order: 'ASC' | 'DESC',
                        @Query('orderBy') orderBy: string) {
        return await this.locationService.byBusiness(id, locationResponses.list, { page, limit, order, orderBy });
    }

    @Roles(LocationPermission.MODIFY)
    @Put(':id')
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: number, @Body() data: UpdateLocationDto,
                 @UserDec() user: IUserReq) {
        return this.locationService.update(id, data, user, locationResponses.modification);
    }

    @Roles(LocationPermission.DISABLE)
    @Put(':id/disable')
    @UsePipes(new ValidationPipe())
    async disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.locationService.disable(id, user, locationResponses.disable);
    }

    @Roles(LocationPermission.DELETE)
    @Delete(':id')
    @UsePipes(new ValidationPipe())
    async delete(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.locationService.delete(id, user, locationResponses.disable);
    }

    @Roles(LocationPermission.ENABLE)
    @Put(':id/activate')
    @UsePipes(new ValidationPipe())
    async activate(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.locationService.activate(id, user, locationResponses.activate);
    }

}
