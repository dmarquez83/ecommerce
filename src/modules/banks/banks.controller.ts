import { Body, Controller, Delete, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/createBank.dto';
import { UpdateBankDto } from './dto/updateBank.dto';

@UsePipes(new TrimPipe())
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
@Controller('banks')
export class BanksController {

    constructor(private readonly banksService: BanksService) {}

    /**
     * Create a Bank
     * 
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Post()
    create(@Body() body: CreateBankDto, @UserDec() user: IUserReq) {
        return this.banksService.create(body, user);
    }

    /**
     * Update a Bank
     * 
     * @param id Bank Id
     * @param body data to update
     * @param user logged user extracted from token 
     */
    @Put(':id')
    update(@Param('id') id: number, @Body() body: UpdateBankDto, @UserDec() user: IUserReq) {
        return this.banksService.update(id, body, user);
    }

    /**
     * Enable a Bank
     * 
     * @param id Bank Id
     * @param user logged user extracted from token 
     */
    @Put('activate/:id')
    enable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.banksService.enable(id, user);
    }

    /**
     * Disable a Bank
     * 
     * @param id Bank Id
     * @param user logged user extracted from token 
     */
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.banksService.disable(id, user);
    }
}
