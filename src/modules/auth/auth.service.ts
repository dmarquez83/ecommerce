import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt = require('bcrypt');
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Provider } from '../../common/enum/provider.enum';
import { Status } from '../../common/enum/status.enum';
import { ReqWithCookies } from '../../common/interfaces/reqWithCookies.interface';
import { userResponses } from '../../common/responses/users.response';
import { TokenService } from '../token/token.service';
import { IUserReq } from '../users/interfaces/userReq.interface';
import { UsersService } from '../users/users.service';
import { ILogin } from './interfaces/ILogin.interface';
import { ILoginReturn } from './interfaces/ILoginReturn.interface';
import { ILogout } from './interfaces/ILogout.interface';
import { IVerifyGoogle } from './interfaces/verifyGoogle.interface';

@Injectable()
export class AuthService {

    private clientID = this.configService.get('PYNPON_GOOGLE_CLIENTID');
    private client = new OAuth2Client(this.clientID);

    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService,
                private readonly tokenService: TokenService) { }

    /**
     *  Function that validates the username (or email) and password,
     *  if both are correct, generates session token
     * 
     * @param userNameOrEmail: Username (or email) typed by the user 
     * @param password: plain text password typed by the user 
     * 
     */
    async validateUser(userNameOrEmail: string, password: string, responses: any) {
        const user = await this.usersService.findByUsernameOrEmail(userNameOrEmail);
        // Wrong userName or password
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException(responses.wrongData);
        }

        // Check user status
        this.checkStatus(user.status);

        delete user.password;

        // Generate token
        const tokenDB = await this.tokenService.generateTokens(user);
        
        return { ...responses.success, user, ...tokenDB};
    }

    /**
     * Check if the user is active, if not throws exception
     * @param status: status property of a user
     */
    checkStatus(status: string) {
        if (status !== Status.ENABLED) {
            throw new UnauthorizedException({
                status: false,
                code: 1002,
                message: 'User is not active'
            });
        }

        return;
    }

    /** 
     * Google verify function used to check the token and validate the google sign in 
     * @param token: token provided by google in the front-ent
     */
    async verify(token: string) {

        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: this.clientID,
        });
        const payload = ticket.getPayload();

        return {
            name: payload.given_name,
            lastName: payload.family_name,
            email: payload.email
        };
    }

    /**
     * Responsible for catching the exception generated by verifying the token with google
     * @param tokenGoogle 
     */
    async googleVerify(tokenGoogle: string): Promise<IVerifyGoogle> {
        return await this.verify(tokenGoogle)
            .catch(err => {
                throw new UnauthorizedException({
                    status: false,
                    message: err.message,
                    code: '',
                });
            });
    }

    /**
     * Login or Create user using social media sign in
     * @param data: must have two params:
     *  - provider: social media company or entity used to login users(e.g google, facebook, ...)
     *  - token: session token provisioned by the provider
     */
    @Transactional()
    async loginSocialMedia(data: any, responses: any) {

        const profile = await this.setDataUserSocialMedia(data);
        let user = await this.usersService.emailOrUsernameExist(profile);
        
        if (user) {
            if (profile.provider !== user.provider) {
                throw new UnauthorizedException(responses.loginTypeInvalid);
            }

            // Check user status
            this.checkStatus(user.status);

            const tokenDB = await this.tokenService.generateTokens(user);
            return { ...responses.success, user, ...tokenDB};
        }
        
        user = await this.usersService.create({ ...profile }, userResponses.creation);

        return { ...responses.success, 
                user: user['user'],
                token: user['token'],
                refreshToken: user['refreshToken']
            };
    }

    /**
     * Construct de user data to generate the session token or create
     * the user depending of the case.
     * @param data must have two params:
     *  - provider: social media company or entity used to login users(e.g google, facebook, ...)
     *  - token: session token provisioned by the provider
     */
    async setDataUserSocialMedia(data: any) {

        if (data.provider === Provider.GOOGLE) {
            const googleUser = await this.googleVerify(data.token);
            return {
                mail: googleUser.email,
                username: null,
                firstName: googleUser.name,
                lastName: googleUser.lastName,
                status: Status.ENABLED,
                provider: Provider.GOOGLE as Provider,
                password: null,
                imgCode: null
            };
        } 
        return {
            provider: Provider.FACEBOOK as Provider,
            lastName: data.name.familyName,
            firstName: data.name.givenName,
            mail: data.emails[0].value,
            username: null,
            status: Status.ENABLED,
            password: null,
            imgCode: null
        };
    }

    /**
     *  Refresh the token and delete the refresh token used
     * @param refreshToken Refresh token
     * @param token Expired Token
     * @param idUser Id User
     * @param responses Response with the structure to return
     */
    async refreshToken(refreshToken: string, token: string, idUser: number, responses: any) {

        if (!refreshToken) {
            throw new UnauthorizedException(responses.notCookies);
        }
        
        const decodedToken = this.jwtService.decode(token);

        if (!decodedToken) {
            throw new UnauthorizedException(responses.tokenNotValid);
        }

        if (Number(idUser) === Number(decodedToken.sub)) {

            const user = await this.usersService.findOneWithOptionsOrFail({
                where: [{
                    id: idUser, mail: decodedToken['mail'], 
                    status: decodedToken['status'], 
                    identityDocument: decodedToken['identification'] }]
            }).catch(() => {
                throw new UnauthorizedException(responses.tokenNotValid);
            });

            const tokenDB = await this.tokenService.updateRefreshToken(
                                        refreshToken, 
                                        token, 
                                        user, 
                                        responses
                                    );

            return { ...responses.success, user, ...tokenDB};
        } 

        throw new UnauthorizedException(responses.idUserDontMatch);
    }

    /**
     *  Response cookies and data
     * @param req Request to map the cookies
     * @param data Data of logged user
     */
    async responseCookiesOrHeaders(req: ReqWithCookies, data: ILogin): Promise<ILoginReturn> {
        return await this.tokenService.responseCookiesOrHeaders(req, data);
    }

    /**
     *  Logout and erase the cookies
     * @param dataTokens Data with token and refreshToken
     * @param res respone Object
     * @param user Logged User
     * @param response response with the structure to return
     */
    async logout(dataTokens: ILogout, res: Response, user: IUserReq, response: any) {

        await this.tokenService.removeToken(dataTokens.refreshToken, dataTokens.token, user, response);
       
        res.clearCookie('token', { expires: new Date(1), path: '/', domain: dataTokens.domain});
        res.clearCookie('refreshToken', { expires: new Date(1), path: '/', domain: dataTokens.domain});

        return res.status(200).json(response.success);
    }
}