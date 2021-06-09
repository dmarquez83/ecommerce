import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models';
import { BusinessesModule } from '../businesses/businesses.module';
import { FilesModule } from '../files/files.module';
import { TokenModule } from '../token/token.module';
import { UserRolesModule } from '../userRoles/userRoles.module';
import { WalletModule } from '../wallet/wallet.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('SECRET'),
            }),
            inject: [ConfigService],
        }), FilesModule, BusinessesModule,
        WalletModule, TokenModule, UserRolesModule
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }
