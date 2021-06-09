import { Column, Entity, Index, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Characteristics, Property, User } from './';

@Index('property_characteristics_pkey', ['idCharacteristic', 'idProperty'], {
    unique: true,
})
@Entity('property_characteristics', { schema: 'system' })
export class PropertyCharacteristic {
    @Column('integer', { primary: true, name: 'id_property' })
    idProperty: number;

    @Column('integer', { primary: true, name: 'id_characteristic' })
    idCharacteristic: number;

    @Column('boolean', { name: 'main', default: () => 'false' })
    main: boolean;

    @Column('boolean', { name: 'disabled', default: () => 'false' })
    disabled: boolean;

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

    @ManyToOne(() => User, (users) => users.propertyCharacteristicsCreated)
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => Characteristics,
        (characteristics) => characteristics.propertyCharacteristics
    )
    @JoinColumn([{ name: 'id_characteristic', referencedColumnName: 'id' }])
    characteristics: Characteristics;

    @ManyToOne(
        () => Property,
        (properties) => properties.propertyCharacteristics
    )
    @JoinColumn([{ name: 'id_property', referencedColumnName: 'id' }])
    properties: Property;

    @ManyToOne(() => User, (users) => users.propertyCharacteristicsModified)
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;
}
