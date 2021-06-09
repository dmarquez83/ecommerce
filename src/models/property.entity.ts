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
import { CategoryProperty, PropertyCharacteristic, User } from '.';

@Index('properties_pkey', ['id'], { unique: true })
@Index('properties_name_type_key', ['name', 'type'], { unique: true })
@Entity('properties', { schema: 'system' })
export class Property {
    @PrimaryGeneratedColumn({ type: 'int8', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'type', unique: true, length: 50 })
    type: string;

    @Column('character varying', {
        name: 'description',
        nullable: true,
        length: 50,
    })
    description: string | null;

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

    @OneToMany(
        () => CategoryProperty,
        (CategoryProperty) => CategoryProperty.properties
    )
    categoryProperties: CategoryProperty[];

    @ManyToOne(() => User, (users) => users.propertiesCreated)
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(() => User, (users) => users.propertiesModified)
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    @OneToMany(
        () => PropertyCharacteristic,
        (propertyCharacteristics) => propertyCharacteristics.properties
    )
    propertyCharacteristics: PropertyCharacteristic[];
}
