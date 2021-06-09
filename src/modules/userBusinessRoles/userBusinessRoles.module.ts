import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions, RolePermissions, UserBusinessRole, UserRole } from '../../models';
import { UserBusinessRolesService } from './userBusinessRoles.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Permissions, RolePermissions, UserBusinessRole, UserRole])],
    providers: [UserBusinessRolesService],
    exports: [UserBusinessRolesService]
})
export class UserBusinessRolesModule { }
