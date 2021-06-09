import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { Role, User } from '.';

@Index('user_roles_pkey', ['idRole', 'idUser'], { unique: true })
@Entity('user_roles', { schema: 'system' })
export class UserRole {
    @Column('bigint', { primary: true, name: 'id_user' })
    idUser: number;

    @Column('integer', { primary: true, name: 'id_role' })
    idRole: number;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @ManyToOne(
        () => User,
        users => users.createdRoles
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => Role,
        role => role.userRoles
    )
    @JoinColumn([{ name: 'id_role', referencedColumnName: 'id' }])
    rol: Role;

    @ManyToOne(
        () => User,
        users => users.userRol
    )
    @JoinColumn([{ name: 'id_user', referencedColumnName: 'id' }])
    user: User;
}
