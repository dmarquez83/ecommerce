import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TransportService, User, Vehicle  } from '.';

@Index('service_proposals_pkey', ['creationUser', 'idService', 'idVehicle'], {
    unique: true
})
@Entity('service_proposals', { schema: 'transport' })
export class ServiceProposal {
    @Column('bigint', { primary: true, name: 'id_service' })
    idService: number;

    @Column('bigint', { primary: true, name: 'id_vehicle' })
    idVehicle: number;
    
    @Column('numeric', { name: 'price', precision: 24, scale: 10 })
    price: number;

    @Column('character varying', { name: 'status', length: 100 })
    status: string;
    
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

    /**
     * Creation user
     */
    @ManyToOne(
        () => User,
        user => user.serviceProposal
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    /**
     * Creation user
     */
    @ManyToOne(
        () => User,
        user => user.serviceProposal
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    driver: User;

    /**
     * Creation user
     */
    @ManyToOne(
        () => User,
        user => user.serviceProposal
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     *  Transport services associate
     */
    @ManyToOne(
        () => TransportService,
        services => services.serviceProposals
    )
    @JoinColumn([{ name: 'id_service', referencedColumnName: 'id' }])
    transportService: TransportService;

    /**
     * Vehicle of this proposal
     */
    @ManyToOne(
        () => Vehicle,
        vehicles => vehicles.serviceProposals
    )
    @JoinColumn([{ name: 'id_vehicle', referencedColumnName: 'id' }])
    vehicle: Vehicle;
}
