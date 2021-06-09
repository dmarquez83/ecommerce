import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ReqWithCookies } from '../interfaces/reqWithCookies.interface';

@Injectable()
export class CookieInterceptor implements NestInterceptor {

    constructor() {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<ReqWithCookies>();
        const res = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            tap(() => {
                const cookies = req._cookies;
                const date = new Date();

                // 6 months to expired the cookies
                date.setTime(date.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
                
                const expires = date.toISOString();

                const agent = req.get('referer')?.includes('pynpon.com') ? 
                            '.pynpon.com' : 'localhost';

                if (cookies?.length && !req.get('referer')?.includes('mobile')) {
                    cookies.forEach((cookie) => {
                        res.cookie(cookie.name, cookie.val, {
                            domain: agent,
                            secure: agent.includes('pynpon.com'),
                            httpOnly: agent.includes('pynpon.com'),
                            expires: new Date(expires),
                        });
                    });
                }
            })
        );
    }
}