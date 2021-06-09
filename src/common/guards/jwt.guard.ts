import { ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

/**
 * Customized guard to return predefined response when token is not valid
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    canActivate(context: ExecutionContext) {
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
