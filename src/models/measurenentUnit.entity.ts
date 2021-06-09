import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { ListOptions, TransportService, User } from './';

@Index('measurement_units_pkey', ['id'], { unique: true })
@Index('measurement_units_name_key', ['name'], { unique: true })
@Entity('measurement_units', { schema: 'system' })
export class MeasurementUnit {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'type', length: 50 })
    type: string;

    @Column('character varying', { name: 'symbol', length: 50 })
    symbol: string;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @Column('timestamp without time zone', {
        name: 'modification_date',
        nullable: true,
        select: false
    })
    modificationDate: Date | null;

    @ManyToOne(
        () => User,
        users => users.measurementUnitsCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => User,
        users => users.measurementUnitsModifiedBy
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     *  List options of this measurement
     */
    @OneToMany(
        () => ListOptions,
        (listOptions) => listOptions.measurementUnit)
    listOptions: ListOptions[];

    /**
     *  Services associate of this measurement
     */
    @OneToMany(
        () => TransportService,
        TransportService => TransportService.weightUnitEntity
    )
    transporServices: TransportService[];
}
