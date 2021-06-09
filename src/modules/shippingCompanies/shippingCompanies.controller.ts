import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { ShippingCompanyCreateDto } from './dto/shippingCompanyCreate.dto';
import { ShippingCompanyUpdateDto } from './dto/shippingCompanyUpdate.dto';
import { ShippingCompaniesService } from './shippingCompanies.service';

@UsePipes(new TrimPipe())
@Controller('shippingCompanies')
export class ShippingCompaniesController {

    constructor(private readonly shippingCompaniesService: ShippingCompaniesService) {}

    /**
     * Find All Shipping Companies
     */
    @Get('')
    findAll() {
        return this.shippingCompaniesService.findAll();
    }

    /**
     * Find a Shipping Company by its id
     * @param id Shipping Company id
     */
    @Get(':id')
    findById(@Param('id') id: number) {
        return this.shippingCompaniesService.findById(id);
    }
    
    /**
     * Disable a Shipping Company by its id
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.shippingCompaniesService.disable(id, user);
    }

    /**
     * Create a new Shipping Company
     * @param body data to create
     * @param user logged user extracted from token
     */
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post('')
    create(@Body() body: ShippingCompanyCreateDto, @UserDec() user: IUserReq) {
        return this.shippingCompaniesService.create(body, user);
    }

    /**
     * Mopify a Shipping Company by its id
     * 
     * @param id Shipping company id to update
     * @param body data to update
     * @param user logged user extracted from token
     */
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() Body: ShippingCompanyUpdateDto, @UserDec() user: IUserReq) {
        return this.shippingCompaniesService.update(id, Body, user);
    }

    /**
     * Enable a Shipping Company
     */
    @Put('activate/:id')
    @UseGuards(JwtAuthGuard)
    enable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return  this.shippingCompaniesService.enable(id, user);
    }
    
}
