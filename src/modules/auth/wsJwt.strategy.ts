import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Status } from '../../common/enum/status.enum';
import { cookieOrHeaderExtractor } from '../../common/extractor/cookieOrHeaderExtractor.extractor';
import { UsersService } from '../users/users.service';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
    
    constructor(private readonly configService: ConfigService,
                private readonly userService: UsersService) {
                    
        super({
            jwtFromRequest: cookieOrHeaderExtractor,
            ignoreExpiration: false,
            secretOrKey: configService.get('SECRET')
        });
    }

    async validate(payload) {

        await this.userService.findOneOrFail(payload.sub, {where: [{status: Status.ENABLED}]})
            .catch(() => {
                throw new ForbiddenException({
                    code: 5,
                    status: false,
                    message: 'Logged user is not active'
                });
            });

        return {
            userId: payload.sub, username: payload.username
        };
    }
}
