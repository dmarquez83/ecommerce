import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { MeasurementUnit, ServiceFile, ServiceProposal, User, Vehicle } from '.';

@Index('services_pkey', ['id'], { unique: true })
@Entity('services', { schema: 'transport' })
export class TransportService {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number;

    @Column('character varying', { name: 'origin_address', length: 500 })
    originAddress: string;

    @Column('jsonb', { name: 'origin_coordinates' })
    originCoordinates: object;

    @Column('character varying', { name: 'destination_address', length: 500 })
    destinationAddress: string;

    @Column('jsonb', { name: 'destination_coordinates' })
    destinationCoordinates: object;

    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    @Column('character varying', { name: 'type', length: 255 })
    type: string;

    @Column('integer', { name: 'packages', default: () => '0' })
    packages: number;

    @Column('integer', { name: 'passengers', default: () => '0' })
    passengers: number;

    @Column('integer', { name: 'bags', default: () => '0' })
    bags: number;

    @Column('numeric', {
        name: 'weight',
        precision: 24,
        scale: 10,
        default: () => '0'
    })
    weight: number;

    @Column('character varying', { name: 'distance', length: 50 })
    distance: number;

    @Column('character varying', { name: 'duration', length: 50 })
    duration: number;

    @Column('int4', { name: 'weight_unit' })
    weightUnit: number;

    @Column('int4', { name: 'id_vehicle' })
    idVehicle: number;

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

    /**
     *  Vehicle of this service
     */
    @ManyToOne(
        () => Vehicle,
        vehicle => vehicle.services
    )
    @JoinColumn([{ name: 'id_vehicle', referencedColumnName: 'id' }])
    vehicle: Vehicle;

    /**
     *  Creation user
     */
    @ManyToOne(
        () => User,
        user => user.servicesCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    /**
     * Modification user
     */
    @ManyToOne(
        () => User,
        user => user.servicesModified
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     *  Measurement Unit associate
     */
    @ManyToOne(
        () => MeasurementUnit,
        measurementUnit => measurementUnit.transporServices
    )
    @JoinColumn([{ name: 'weight_unit', referencedColumnName: 'id' }])
    weightUnitEntity: MeasurementUnit;

    /**
     *  File service 
     */
    @OneToMany(
        () => ServiceFile,
        serviceFiles => serviceFiles.idService
    )
    serviceFiles: ServiceFile[];

    /**
     *  Service proposals
     */
    @OneToMany(
        () => ServiceProposal,
        serviceProposals => serviceProposals.transportService
    )
    serviceProposals: ServiceProposal[];
}
