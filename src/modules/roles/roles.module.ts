import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../models';
import { UserBusinessRolesModule } from '../userBusinessRoles/userBusinessRoles.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role]), UserBusinessRolesModule],
    providers: [RolesService],
    controllers: [RolesController],
    exports: [RolesService],
})
export class RolesModule { }
