import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken} from '../../models';
import { TokenService } from './token.service';

@Module({
  imports: [
            TypeOrmModule.forFeature([RefreshToken]),
            JwtModule.registerAsync({
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    secret: configService.get('SECRET'),
                }),
                inject: [ConfigService],
            })
        ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
