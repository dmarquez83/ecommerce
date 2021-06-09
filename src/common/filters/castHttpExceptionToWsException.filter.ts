import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class CastHttpExceptionToWsException extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        super.catch(new WsException(exception['response']), host);
    }
}
