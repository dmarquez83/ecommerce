import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { AppModule } from './app.module';
async function bootstrap() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create(AppModule);
    const cors = {
        origin: [
            'http://localhost:4200',
            'http://localhost:5030',
            'http://localhost:8000',
            'http://localhost',
            'https://pynpon.com',
            'http://mobile.pynpon.com:4201',
            'https://mobile.pynpon.com',
            '*',
        ],
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
        allowedHeaders: [
            'Accept',
            'Content-Type',
            'Authorization',
            'Cookie',
            'language',
            'token',
            'refreshToken',
        ],
        exposedHeaders: ['token_expired'],
    };
    app.enableCors(cors);
    app.use(cookieParser());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(3000);
}
bootstrap();