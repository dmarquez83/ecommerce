import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/createCurrency.dto';
import { UpdateCurrencyDto } from './dto/updateCurrency.dto';

@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
@UsePipes(new TrimPipe())
@Controller('currencies')
export class CurrenciesController {

    constructor(private readonly currenciesService: CurrenciesService) {}
    
    /**
     * Create a Currency
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Post()
    create(@Body() body: CreateCurrencyDto, @UserDec() user: IUserReq) {
        return this.currenciesService.create(body, user);
    }
    
    /**
     * Update a Currency
     * @param id Currency Id
     * @param body data to update
     * @param user logged user extracted from token
     */
    @Put(':id')
    update(@Param('id') id: number, @Body() body: UpdateCurrencyDto, @UserDec() user: IUserReq) {
        return this.currenciesService.update(id, body, user);
    }

    /**
     * Enable a Currency
     * @param id Currency Id
     * @param user logged user extracted from token
     */
    @Put('activate/:id')
    enable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.currenciesService.enable(id, user);
    }

    /**
     * Disable a Currency
     * @param id Currency Id
     * @param user logged user extracted from token
     */
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.currenciesService.disable(id, user);
    }
    
    /**
     * Find all Currencies
     */
    @Get()
    findAll() {
        return this.currenciesService.findAll();
    }
    
    /**
     * Find a Currency by its Id
     * @param id Currency Id
     */
    @Get(':id')
    findById(@Param('id') id: number) {
        return this.currenciesService.findById(id);
    }

}
