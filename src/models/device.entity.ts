import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '.';

@Index('devices_pkey', ['token'], { unique: true })
@Entity('devices', { schema: 'system' })
export class Device {
    @Column('character varying', { name: 'id_project', length: 400 })
    idProject: string;

    @Column('character varying', { primary: true, name: 'token', length: 400 })
    token: string;

    @Column('int8', { name: 'id_user' })
    idUser: number;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP'
    })
    creationDate: Date;

    @ManyToOne(
        () => User,
        users => users.devices
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;
}
