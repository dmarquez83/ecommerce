import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { BankAccountsService } from './bankAccounts.service';
import { CreateBankAccountDto } from './dto/createBankAccount.dto';
import { UpdateBankAccountDto } from './dto/updateBankAccount.dto';

@UsePipes(new ValidationPipe())
@UsePipes(new TrimPipe())
@UseGuards(JwtAuthGuard)
@Controller('bankAccounts')
export class BankAccountsController {

    constructor(private readonly bankAccountsService: BankAccountsService) {}

    /**
     * Create a Bank Account
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Post()
    create(@Body() body: CreateBankAccountDto, @UserDec() user: IUserReq) {
        return this.bankAccountsService.create(body, user);
    }

    /**
     * Update a Bank Account
     * 
     * @param id Bank Account Id
     * @param body data to upate
     * @param user logged user extracted from token
     */
    @Put(':id')
    update(@Param('id') id: number, @Body() body: UpdateBankAccountDto, @UserDec() user: IUserReq) {
        return this.bankAccountsService.update(id, body, user);
    }

    /**
     * Enable a Bank Account
     * @param id Bank Account Id
     * @param user logged user extracted from token
     */
    @Put('activate/:id')
    enable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.bankAccountsService.enable(id, user);
    }

    /**
     * Disable a Bank Account
     * 
     * @param id Bank Account Id
     * @param user logged user extracted from token
     */
    @Delete(':id')
    disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.bankAccountsService.disable(id, user);
    }

    /**
     * Find a Bank Account by its Id
     * @param id Bank Account number
     */
    @Get(':id')
    findById(@Param('id') id: number) {
        return this.bankAccountsService.findById(id);
    }

    /**
     * Find a Bank Account by its wallet
     * @param idWallet wallet Id
     */
    @Get('wallet/:idWallet')
    findByWallet(@Param('idWallet') idWallet: number) {
        return this.bankAccountsService.findByWallet(idWallet);
    }
}
