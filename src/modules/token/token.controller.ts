import { Controller, Get, Headers, Param } from '@nestjs/common';
import { userResponses } from '../../common/responses/users.response';

@Controller('token')
export class TokenController {

    @Get('refreshToken/:idUser')
    refreshToken(@Headers('refresh-token') refreshToken: string, @Headers('token') token: string, @Param('idUser') idUser: number) {
        //return this.authService.refreshToken(refreshToken, token, idUser, userResponses.refreshToken);
    }
}
