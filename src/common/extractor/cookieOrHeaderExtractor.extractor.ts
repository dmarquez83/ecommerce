import { UnauthorizedException } from '@nestjs/common';
import { userResponses } from '../responses/users.response';

export const cookieOrHeaderExtractor = (req) => {
    let token = null;
    
    if (req?.cookies) {
        token = req.cookies['token'];
    }

    if (!req?.cookies && !req.get('referer')?.includes('mobile')) {
        throw new UnauthorizedException(userResponses.refreshToken.cookieNotSent);
    }

    if (!token && req?.headers) {
        token = req.headers['token'];
    }

    return token;
};
