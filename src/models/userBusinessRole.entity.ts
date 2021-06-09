import { Column, Entity, Index, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Business, Role, User } from '.';

@Index('user_business_roles_pkey', ['idRole', 'idBusiness', 'idUser'], {
    unique: true
})
@Entity('user_business_roles', { schema: 'public' })
export class UserBusinessRole {
    
    @Column('bigint', { primary: true, name: 'id_user' })
    idUser: number;

    @Column('integer', { primary: true, name: 'id_role' })
    idRole: number;

    @Column('bigint', { primary: true, name: 'id_business' })
    idBusiness: number;

    @Column('boolean', { name: 'disabled', default: () => false })
    disabled: boolean;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @ManyToOne(
        () => User,
        users => users.userBusinessRolesCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: number | User;

    /**
     *  Business of this relation role-user
     */
    @ManyToOne(
        () => Business,
        business => business.userBusinessRoles
    )
    @JoinColumn([{ name: 'id_business', referencedColumnName: 'id' }])
    business: Business;

    @ManyToOne(
        () => Role,
        roles => roles.userBusinessRoles
    )
    @JoinColumn([{ name: 'id_role', referencedColumnName: 'id' }])
    rol: Role;

    @ManyToOne(
        () => User,
        users => users.userBusinessRoles
    )
    @JoinColumn([{ name: 'id_user', referencedColumnName: 'id' }])
    user: User;

    @ManyToOne(
        () => User,
        (users) => users.userBusinessRolesModified
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;
}
