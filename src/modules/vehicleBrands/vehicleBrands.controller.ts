import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { vehicleBrandsResponses } from '../../common/responses/vehicleBrands.responses';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { CreateVehicleBrandDto } from './dto/createVehicleBrand.dto';
import { UpdateVehicleBrandDto } from './dto/updateVehicleBrand.dto';
import { VehicleBrandsService } from './vehicleBrands.service';

@Controller('vehicleBrands')
export class VehicleBrandsController {

    constructor(
        private readonly vehicleBrandsService: VehicleBrandsService,
    ) { }

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: CreateVehicleBrandDto, @UserDec() user: IUserReq) {
        return await this.vehicleBrandsService.create(data, user, vehicleBrandsResponses.create);
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    async update(@Param() id: number, @Body() data: UpdateVehicleBrandDto,
                 @UserDec() user: IUserReq) {
        return await this.vehicleBrandsService.update(id, data, user, vehicleBrandsResponses.update);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async disable(@Param() id: number, @UserDec() user: IUserReq) {
        return await this.vehicleBrandsService.disable(id, user, vehicleBrandsResponses.disable);
    }

    @UseGuards(JwtAuthGuard)
    @Post('activate/:id')
    async activate(@Param() id: number, @UserDec() user: IUserReq) {
        return await this.vehicleBrandsService.activate(id, user, vehicleBrandsResponses.enable);
    }

    @Get('')
    async getAll() {
        return await this.vehicleBrandsService.findAll(vehicleBrandsResponses.list.success);
    }

    @Get('/:id')
    async findById(@Param() id: number) {
        return await this.vehicleBrandsService.findById(id, vehicleBrandsResponses.list);
    }

}
