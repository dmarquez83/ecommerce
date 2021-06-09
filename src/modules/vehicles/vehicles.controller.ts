import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { vehiclesResponses } from '../../common/responses/vehicles.responses';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { UpdateVehicleDto } from './dto/updateVehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {

    constructor(
        private readonly vehiclesService: VehiclesService,
    ) { }

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: CreateVehicleDto, @UserDec() user: IUserReq) {
        return await this.vehiclesService.create(data, user, vehiclesResponses.create);
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateVehicleDto,
                 @UserDec() user: IUserReq) {
        return await this.vehiclesService.update(id, data, user, vehiclesResponses.update);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/disable')
    async disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return await this.vehiclesService.disable(id, user, vehiclesResponses.disable);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number, @UserDec() user: IUserReq) {
        return await this.vehiclesService.delete(id, user, vehiclesResponses.delete);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/activate')
    async activate(@Param('id') id: number, @UserDec() user: IUserReq) {
        return await this.vehiclesService.activate(id, user, vehiclesResponses.enable);
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getAll(@UserDec() user: IUserReq) {
        return await this.vehiclesService.findAll(vehiclesResponses.list.success, user);
    }

    @Get('/:id')
    async findById(@Param('id') id: number) {
        return await this.vehiclesService.findById(id, vehiclesResponses.list);
    }

}
