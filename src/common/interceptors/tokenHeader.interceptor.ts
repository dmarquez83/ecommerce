import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ReqWithCookies } from '../interfaces/reqWithCookies.interface';

@Injectable()
export class TokenHeaderInterceptor implements NestInterceptor {

    constructor(@Inject('JwtService') private readonly jwtService: JwtService) {}
    
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const res = context.switchToHttp().getResponse<Response>();
        const req = context.switchToHttp().getRequest<ReqWithCookies>();
        
        return next.handle().pipe(
            tap((data) => {
                const cookies = req._cookies;

                // get token from cookies, body or request header
                const token = cookies?.length && !req.get('referer')?.includes('mobile') ?
                              cookies[0]['val'] : data.token || req.header('token'); 

                const tokenDecoded = this.jwtService.decode(token);
                    
                res.setHeader('token_expired', tokenDecoded['exp'] - tokenDecoded['iat']);
            }),
        );
    }
}
