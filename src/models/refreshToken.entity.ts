import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '.';
@Index('refresh_tokens_pkey', ['idUser', 'token'], { unique: true })
@Entity('refresh_tokens', { schema: 'system' })
export class RefreshToken {

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @Column('bigint', { primary: true, name: 'id_user' })
    idUser: number;

    @Column('character varying', { primary: true, name: 'token', length: 400 })
    token: string;

    @Column('character varying', { name: 'refresh', length: 400 })
    refresh: string;

    @ManyToOne(() => User, (user) => user.refreshtokens)
    @JoinColumn([{ name: 'id_user', referencedColumnName: 'id' }])
    user: User;
}
