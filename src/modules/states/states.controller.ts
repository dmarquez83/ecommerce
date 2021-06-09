import {
    Body, Controller, Delete, Get, Param,
    Post, Put, UseGuards, UsePipes
} from '@nestjs/common';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { IUserReq } from '../../modules/users/interfaces/userReq.interface';
import { CreateStateDto } from './dto/createState.dto';
import { UpdateStateDto } from './dto/updateState.dto';
import { StatesService } from './states.service';

@UsePipes(new TrimPipe())
@Controller('states')
export class StatesController {

    constructor(private readonly stateService: StatesService) { }

    /**
     * Find all States
     */
    @Get()
    async findAll() {
        return await this.stateService.findAll();
    }

    /**
     * Find a State by its Id
     * @param id State id
     */
    @Get(':id')
    async findById(@Param('id') id: number) {
        return this.stateService.findById(id);
    }

    /**
     * Disable a State
     * @param id state Id
     * @param user logged user extracted from token
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async disable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.stateService.disable(id, user);
    }

    /**
     * Enable a State
     * @param id state Id
     * @param user logged user extracted from token
     */
    @Put('activate/:id')
    @UseGuards(JwtAuthGuard)
    async enable(@Param('id') id: number, @UserDec() user: IUserReq) {
        return this.stateService.enable(id, user);
    }

    /**
     * Create a State
     * @param body data to create
     * @param user logged user extracted from token
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async create(@Body() body: CreateStateDto, @UserDec() user: IUserReq) {
        return this.stateService.create(body, user);
    }

    /**
     * Update a State
     * @param id state Id
     * @param body data to update
     * @param user logged user extracted from token 
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: number, @Body() body: UpdateStateDto, @UserDec() user: IUserReq) {
        return this.stateService.update(id, body, user);
    }

}
