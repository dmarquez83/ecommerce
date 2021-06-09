import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Lists, PropertyCharacteristic, User } from './';

@Index('characteristics_pkey', ['id'], { unique: true })
@Index('characteristics_name_system_key', ['name', 'system'], { unique: true })
@Entity('characteristics', { schema: 'system' })
export class Characteristics {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'label', length: 255 })
    label: string;

    @Column('character varying', { name: 'data_type', length: 50 })
    dataType: string;

    @Column('boolean', { name: 'unit_required', default: () => 'false' })
    unitRequired: boolean;

    @Column('boolean', { name: 'system', unique: true, default: () => 'true' })
    system: boolean;

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

    @ManyToOne(() => User, (users) => users.characteristicsCreated)
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @Column('integer', { name: 'id_list' })
    idList: Lists;

    @ManyToOne(() => Lists, (lists) => lists.characteristics)
    @JoinColumn([{ name: 'id_list', referencedColumnName: 'id' }])
    list: Lists;

    @ManyToOne(() => User, (users) => users.characteristicsModified)
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    @OneToMany(
        () => PropertyCharacteristic,
        (propertyCharacteristics) => propertyCharacteristics.characteristics
    )
    propertyCharacteristics: PropertyCharacteristic[];
}
