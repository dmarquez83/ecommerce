import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './facebook.strategy';
import { JwtStrategy } from './jwt.strategy';
import { WsJwtStrategy } from './wsJwt.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('SECRET'),
            }),
            inject: [ConfigService],
        }),
        TokenModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        WsJwtStrategy,
        FacebookStrategy
    ],
    exports: [AuthService]
})
export class AuthModule { }
