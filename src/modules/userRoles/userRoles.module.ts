import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../../models';
import { RolesModule } from '../roles/roles.module';
import { UserRolesService } from './userRoles.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserRole]), RolesModule],
    providers: [UserRolesService],
    exports: [UserRolesService],
})
export class UserRolesModule { }
