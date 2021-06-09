import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '.';

@Index('idx_property_combos_characteristics', ['characteristics'], {})
@Index('property_combos_pkey', ['id'], { unique: true })
@Entity('property_combos', { schema: 'public' })
export class PropertyCombo {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('jsonb', { name: 'characteristics' })
    characteristics: object;

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

    @ManyToOne(
        () => User,
        users => users.propertyCombosCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @Column('bigint', { name: 'id_property' })
    idProperty: number;

    @ManyToOne(
        () => User,
        users => users.propertyCombosModified
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
}
