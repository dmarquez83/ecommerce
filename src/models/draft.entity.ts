import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '.';

@Index('drafts_pkey', ['id'], { unique: true })
@Entity('drafts', { schema: 'public' })
export class Draft {
    @Column('character varying', { primary: true, name: 'id', length: 500 })
    id: string;

    @Column('character varying', { name: 'type', length: 255 })
    type: string;

    @Column('jsonb', { name: 'data' })
    data: object;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP'
    })
    creationDate: Date;

    @Column('timestamp without time zone', {
        name: 'modification_date',
        nullable: true
    })
    modificationDate: Date | null;

    /**
     * User creation 
     */
    @ManyToOne(
        () => User,
        users => users.drafts
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    /**
     * User modification
     */
    @ManyToOne(
        () => User,
        users => users.draftModified
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
}
