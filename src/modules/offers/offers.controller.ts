import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { TrimPipe } from './../../common/pipes/trim.pipe';
import { CreateOfferDto } from './dto/createOffer.dto';
import { UpdateOfferDto } from './dto/updateOffer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtAuthGuard)
@UsePipes(new TrimPipe())
@Controller('offers')
export class OffersController {

    constructor( private readonly offerService: OffersService) {}

    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() offerBody: CreateOfferDto, @UserDec() user: IUserReq) {
        return this.offerService.create(offerBody, user);
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: number, @Body() offerBody: UpdateOfferDto, @UserDec() user: IUserReq) {
        return this.offerService.update(id, offerBody, user);
    }

    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findById(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.offerService.findById(id, user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('business/:id')
    findByBusiness( @Param('id') id: number,
                    @Query('page') page: number,
                    @Query('limit') limit: number,
                    @Query('order') order: 'ASC' | 'DESC',
                    @Query('orderBy') orderBy: string, 
                    @UserDec() user: IUserReq) {
        return this.offerService.findOfferByBusiness(id, {page, limit, order, orderBy}, user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.offerService.disable(id, user);
    }    
}
