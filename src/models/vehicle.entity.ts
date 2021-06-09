import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceProposal, TransportService, User, VehicleBrand, VehicleFile } from '.';

@Index('vehicles_pkey', ['id'], { unique: true })
@Index('vehicles_plate_key', ['plate'], { unique: true })
@Index('vehicles_uq_idx', ['plate'], { unique: true })
@Entity('vehicles', { schema: 'transport' })
export class Vehicle {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: string;

    @Column('character varying', { name: 'model', length: 255 })
    model: string;

    @Column('character varying', { name: 'color', length: 255 })
    color: string;

    @Column('character varying', {
        name: 'plate',
        unique: true,
        length: 50,
    })
    plate: string;

    @Column('integer', { name: 'seats' })
    seats: number;

    @Column('character varying', { name: 'status', length: 100 })
    status: string;

    @Column('int4', { name: 'id_brand' })
    idBrand: string;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false,
    })
    creationDate: Date;

    @Column('timestamp without time zone', {
        name: 'modification_date',
        nullable: true,
        select: false,
    })
    modificationDate: Date | null;

    /**
     *  Creation user
     */
    @ManyToOne(
        () => User,
        (user) => user.vehiclesCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    /**
     *  Modification user
     */
    @ManyToOne(
        () => User,
        (users) => users.vehiclesModified
    )
    @JoinColumn([
        { name: 'modification_user', referencedColumnName: 'id' },
    ])
    modificationUser: User;

    /**
     *  Brand of this vehicle
     */
    @ManyToOne(
        () => VehicleBrand,
        (vehicleBrand) => vehicleBrand.vehicles
    )
    @JoinColumn([{ name: 'id_brand', referencedColumnName: 'id' }])
    brand: VehicleBrand;

    /**
     *  Services of this vehicle
     */
    @OneToMany(
        () => TransportService,
        services => services.vehicle
    )
    services: TransportService[];

    /**
     * Files of this vehicle
     */
    @OneToMany(
        () => VehicleFile,
        vehicleFiles => vehicleFiles.vehicle
    )
    vehicleFiles: VehicleFile[];

    /**
     * Proposal of this vehicle
     */
    @OneToMany(
        () => ServiceProposal,
        serviceProposals => serviceProposals.vehicle
    )
    serviceProposals: ServiceProposal[];
}
