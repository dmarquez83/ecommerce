import { ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard extends AuthGuard('ws-jwt') {

    canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient();
        const authToken: string = client.handshake?.query?.token;
        context.switchToHttp().getRequest()['url'] = `?token=${authToken}`;
        return super.canActivate(context);
    }

    handleRequest(err, user, info): any {

        if (info instanceof TokenExpiredError) {
            throw new UnauthorizedException({
                status: false,
                code: 2,
                message: `${info.name}: ${info.message}`,
                expiredAt: info.expiredAt
            });
        }

        if (err) {
            throw err;
        }

        if (!user) {
            throw new UnauthorizedException({
                code: 1,
                status: false,
                message: 'Unauthorized'
            });
        }

        return user;
    }
}
