import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenExpiredError } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { BasicService } from '../../common/services/base.service';
import { RefreshToken } from '../../models';
import { ITokenGenerate } from './interfaces/tokenGenerate.interface';

@Injectable()
export class TokenService extends BasicService<RefreshToken> {

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
    ) {
        super(refreshTokenRepository);
    }
    
    /**
     * Generate token to manage authorization
     * @param data: payload of the token. It must be of type
     *  ITokenGenerate
     */
    generateTokenJwt(data: ITokenGenerate) {
        const min = Number(this.configService.get('EXPIRED_TOKEN_MIN'));
        const max = Number(this.configService.get('EXPIRED_TOKEN_MAX'));

        const randomExpired = Math.floor(Math.random() * (max - min + 1)) + min;

        return this.jwtService.sign(data, { expiresIn: randomExpired });
    }

    /**
     * Generate Token to header requests
     * @param user Logged user
     */
    async generateToken(user: any) {
        return this.generateTokenJwt({
            username: user.username,
            mail: user.mail,
            sub: user.id,
            status: user.status,
            identification: user.identityDocument,
            telephone: user.telephone
        });
    }

    /**
     * Generate Refresh Token to refresh new token
     */
    async generateRefreshToken() {
        return this.generateRandomCodeByLength(350);
    }

    /**
     * Save refresh token
     * @param refreshToken refresh token to be saved
     */
    async saveRefreshToken(refreshToken) {
        await this.refreshTokenRepository.save(refreshToken)
            .catch(() => {
                throw new InternalServerErrorException('An error has ocurred saving refresh token');
            });
    }

    /**
     *  Save the new refresh token 
     * @param user Logged user
     */
    async generateTokens(user: any) {

        // generate the new token 
        const newToken = await this.generateToken(user);

        // Generate new refresh Token
        const newRefreshToken = await this.generateRefreshToken();

        // Generate new Refresh token and saved it in db.
        const newRt: RefreshToken = {
            idUser: user.id,
            token: newToken,
            refresh: newRefreshToken,
            user,
            creationDate: new Date()
        };

        await this.saveRefreshToken(newRt);

        return {
            token: newToken,
            refreshToken: newRefreshToken
        };
    }

    /**
     *  Update token and Refresh token
     * @param refreshToken current RefreshToken
     * @param token current token
     * @param user Logged user
     * @param responses response with the structure to return
     */
    async updateRefreshToken(refreshToken: string, token: string, user: any, responses: any) {

        const rt = await this.refreshTokenRepository.findOneOrFail({
            where: [{idUser: user.id, token, refresh: refreshToken}]
        }).catch((e) => {
            throw new UnauthorizedException(responses.refreshNotValid);
        });

        try {
            await this.deleteRefreshTokenEntity(rt);
        } catch (e) {
            if (e instanceof TokenExpiredError) { throw new UnauthorizedException(responses.refreshExpired); }
            
            throw new UnauthorizedException(responses.refreshNotValid);
        }

        return await this.generateTokens(user);
    }

    /**
     *  Remove Token in DB to logout
     * @param refreshToken Current refreshToken
     * @param token current Token
     * @param user Logged user
     * @param responses response with the structure to return
     */
    async removeToken(refreshToken: string, token: string, user: any, responses: any) {

        const rt = await this.refreshTokenRepository.findOneOrFail({
            where: [{idUser: +user.userId, token, refresh: refreshToken}]
        }).catch(() => {
            throw new UnauthorizedException(responses.error);
        });

        try {
            await this.deleteRefreshTokenEntity(rt);
        } catch (e) {
            throw new UnauthorizedException(responses.error);
        }
    }

    /**
     * Delete the refresh token in db
     */
    async deleteRefreshTokenEntity(data: RefreshToken) {
        await this.refreshTokenRepository.remove(data);
    }
}
