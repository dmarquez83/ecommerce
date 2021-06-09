import {
    Body, Controller, Delete, Get, Param,
    Patch, Post, Put, Req, UnauthorizedException, UseInterceptors, UsePipes
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDec } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { TokenHeaderInterceptor } from '../../common/interceptors/tokenHeader.interceptor';
import { CookieInterceptor } from '../../common/interceptors/cookie.interceptor';
import { IResponseStructureReturn } from '../../common/interfaces';
import { ReqWithCookies } from '../../common/interfaces/reqWithCookies.interface';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { userResponses } from '../../common/responses/users.response';
import { User } from '../../models';
import { ValidationPipe } from './../../common/pipes/validation.pipe';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IUserReq } from './interfaces/userReq.interface';
import { UsersService } from './users.service';

@UsePipes(new TrimPipe())
@Controller('users')
export class UsersController {

    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Responsible for updated user
     * @param updateUserDto Object with the data to update the user. 
     * @returns Updated User.
     */
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch('change-password')
    async changePassword(@Body() data: ChangePasswordDto, @UserDec() user: IUserReq) {
        return this.userService.changePassword(data, user, userResponses.changePassword);
    }

    /**
     *  Responsible for creating the user
     * @param data object with the required data to create the user 
     */
    @UseInterceptors(CookieInterceptor)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(TokenHeaderInterceptor)
    @Post()
    async create(@Req() req: ReqWithCookies, @Body() data: CreateUserDto) {
        const userCreated = await this.userService.create(data, userResponses.creation);
        return await this.userService.responseCookiesOrHeaders(req, userCreated);
    }

    /**
     * Deletes a user, this doesn't delete from the database,
     * this just updates the status to deleted
     * 
     * @param id: user id that is going to be deleted 
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param() id: number, @UserDec() user: IUserReq) {
        return await this.userService.findByIdAndDelete(id, userResponses.delete, user);
    }

    /**
     * Disable a user, this doesn't delete from the database,
     * this just updates the status to disabled
     * 
     * @param id: user id that is going to be disabled 
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id/disable')
    async disable(@Param() id: number, @UserDec() user: IUserReq) {
        return await this.userService.disable(id, userResponses.disable, user);
    }

    /**
     * Activate a user, this doesn't delete from the database,
     * this just updates the status to Active
     * 
     * @param id: user id that is going to be Activate 
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id/activate')
    async enable(@Param() id: number, @UserDec() user: IUserReq) {
        return await this.userService.enable(id, userResponses.enable, user);
    }

    /**
     * Get all users.
     * @returns Promise with alls users.
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    /**
     * Get the current (logged in) user.
     * @returns Promise with the current user.
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@UserDec() user: IUserReq): Promise<IResponseStructureReturn> {
        if (user) {
            return await this.userService.findById(user.userId, userResponses.list);
        }
        throw new UnauthorizedException(userResponses.list.error);
    }

    /**
     * Gets a user with specified id
     * 
     * @param id user id  
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findById(@Param('id') id: number): Promise<IResponseStructureReturn> {
        return this.userService.findById(id, userResponses.list);
    }

    /**
     * Gets a user with specified id
     * 
     * @param id user id  
     */
    @UseGuards(JwtAuthGuard)
    @Get('exists/:mail')
    findByMail(@Param('mail') mail: string): Promise<IResponseStructureReturn> {
        return this.userService.findByMail(mail, userResponses.list);
    }

    /**
     * Responsible for updated user
     * @param updateUserDto Object with the data to update the user. 
     * @returns Updated User.
     */
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Put('profile')
    async update(@Body() updateUserDto: UpdateUserDto, @UserDec() user: IUserReq) {
        return await this.userService.update(updateUserDto, user, userResponses.modification);
    }
}
