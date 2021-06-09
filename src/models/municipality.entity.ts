import {
    Column, Entity, Index, JoinColumn, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Location, State, User } from './';

@Index('municipalities_pkey', ['id'], { unique: true })
@Index('municipalities_id_state_name_key', ['idState', 'name'], {
    unique: true,
})
@Entity('municipalities', { schema: 'system' })
export class Municipality {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    // Municipality name
    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    // Municipality status
    @Column('character varying', { name: 'status', length: 100, select: false })
    status: string;

    @Column('integer', { name: 'id_state', unique: true })
    idState: number;

    // Creation date and time of the Municipality
    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    // Modification date and time of the Municipality
    @UpdateDateColumn({
        type: 'timestamp without time zone',
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    /**
     *  Creation user
     */
    @Column({ name: 'creation_user', type: 'int4', select: false })
    @ManyToOne(
        () => User,
        user => user.municipalities,
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    /**
     *  Modification User
     */
    @Column({ name: 'modification_user', type: 'int4', select: false })
    @ManyToOne(
        () => User,
        users => users.municipalities,
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     *  Users that belong to the Municipality
     */
    @OneToMany(
        () => User,
        user => user.municipality,
    )
    users: User[];

    // State of the Municipality
    @ManyToOne(
        () => State,
        states => states.municipalities
    )
    @JoinColumn([{ name: 'id_state', referencedColumnName: 'id' }])
    state: State;

    /**
     *  Locations of the municipality
     */
    @OneToMany(
        () => Location,
        location => location.idMunicipality,
    )
    locations: Location[];

}
