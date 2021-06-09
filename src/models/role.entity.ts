import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Permissions, RolePermissions, User, UserBusinessRole, UserRole } from '.';

@Index('roles_pkey', ['id'], { unique: true })
@Index('roles_name_key', ['name'], { unique: true })
@Entity('roles', { schema: 'system' })
export class Role {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    @Column('character varying', { name: 'type', length: 50 })
    type: string;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    @ManyToOne(
        () => User,
        users => users.createdRoles
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => User,
        users => users.modifiedRoles
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    @OneToMany(
        () => UserRole,
        userRoles => userRoles.rol
    )
    userRoles: UserRole[];

    @OneToMany(
        () => UserBusinessRole,
        userBusinessRoles => userBusinessRoles.rol
    )
    userBusinessRoles: UserBusinessRole[];

    @OneToMany(
        () => RolePermissions,
        rolePermissions => rolePermissions.rol
    )
    rolePermissions: RolePermissions[];

    @ManyToMany(
        () => Permissions
    )
    @JoinTable({
        name: 'role_permissions',
        joinColumns: [
            { name: 'id_role' }
        ],
        inverseJoinColumns: [
            { name: 'id_permission' }
        ]
    })
    permissions: Permissions[];
}
