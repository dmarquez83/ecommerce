import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Permissions, Role, User } from './';

@Index('role_permissions_pkey', ['idPermission', 'idRole'], { unique: true })
@Entity('role_permissions', { schema: 'system' })
export class RolePermissions {
  @Column('integer', { primary: true, name: 'id_role' })
  idRole: number;

  @Column('integer', { primary: true, name: 'id_permission' })
  idPermission: number;

  @Column('timestamp without time zone', {
    name: 'creation_date',
    default: () => 'CURRENT_TIMESTAMP',
    select: false
  })
  creationDate: Date;

  @ManyToOne(
    () => User,
    users => users.rolePermissionsCreated
  )
  @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
  creationUser: User;

  @ManyToOne(
    () => Permissions,
    permissions => permissions.rolePermissions
  )
  @JoinColumn([{ name: 'id_permission', referencedColumnName: 'id' }])
  permission: Permissions;

  @ManyToOne(
    () => Role,
    roles => roles.rolePermissions
  )
  @JoinColumn([{ name: 'id_role', referencedColumnName: 'id' }])
  rol: Role;
  
}
