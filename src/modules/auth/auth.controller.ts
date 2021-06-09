import {
    Body, Controller, Get, Headers, Param,
    Post, Req, Res, UseGuards, UseInterceptors, UsePipes
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserDec } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CookieInterceptor } from '../../common/interceptors/cookie.interceptor';
import { TokenHeaderInterceptor } from '../../common/interceptors/tokenHeader.interceptor';
import { ReqWithCookies } from '../../common/interfaces/reqWithCookies.interface';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { userResponses } from '../../common/responses/users.response';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { AuthService } from './auth.service';

@UseInterceptors(CookieInterceptor)
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    /* 
     *   Receives the requests (email or username and password) to login users 
     */
    @UsePipes(new ValidationPipe())
    @UseInterceptors(TokenHeaderInterceptor)
    @Post('login')
    async loginUser(@Body('usernameOrEmail') username: string,
                    @Body('password') password: string, @Req() req: ReqWithCookies) {

        const loginReturn = await this.authService
            .validateUser(username, password, userResponses.login);

        return await this.authService.responseCookiesOrHeaders(req, loginReturn);
    }

    /** 
     *  Login or Register using google sign in.
     * @param body: it's required to have two params: 
     */
    @UseInterceptors(TokenHeaderInterceptor)
    @Post('google')
    async loginGoogle(@Body() body, @Req() req: ReqWithCookies) {

        const loginSocialMediaReturn = await this.authService
            .loginSocialMedia(body, userResponses.login);

        return await this.authService.responseCookiesOrHeaders(req, loginSocialMediaReturn);
    }

    /**
     *  It is responsible for making the connection 
     *  with facebook and logging in or registering
     * @param req The response sent from the provider "facebook" with the user data login
     */
    @UseInterceptors(TokenHeaderInterceptor)
    @UseGuards(AuthGuard('facebook-token'))
    @Post('facebook')
    async loginFacebook(@Req() req: any) {
        const loginFBReturn = await this.authService
            .loginSocialMedia(req.user, userResponses.login);

        return await this.authService.responseCookiesOrHeaders(req, loginFBReturn);
    }

    @UseInterceptors(TokenHeaderInterceptor)
    @Get('refreshToken/:idUser')
    async refreshToken(@Headers('refreshToken') refreshToken: string,
                       @Headers('token') token: string,
                       @Param('idUser') idUser: number,
                       @Req() req: ReqWithCookies) {
        const refreshTokenReturn = await this.authService
            .refreshToken(req.cookies.refreshToken || refreshToken, req.cookies.token || token,
                idUser, userResponses.refreshToken);

        return await this.authService.responseCookiesOrHeaders(req, refreshTokenReturn);
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Headers('refreshToken') refreshToken: string,
                 @Headers('token') token: string,
                 @Req() req: ReqWithCookies,
                 @UserDec() user: IUserReq,
                 @Res() res: Response) {
        
        const agent = req.get('referer')?.includes('pynpon.com') ? '.pynpon.com' : 'localhost';
        const dataToken = {
            token: req.cookies.token || token,
            refreshToken: req.cookies.refreshToken || refreshToken,
            domain: agent,
            secure: agent.includes('pynpon.com'),
            httpOnly: agent.includes('pynpon.com')
        };
        
        return await this.authService.logout(dataToken, res, user, userResponses.logout);
    }
}
