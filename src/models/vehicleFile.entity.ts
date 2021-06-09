import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne
} from 'typeorm';
import { File, User, Vehicle } from '.';

@Index('vehicle_files_pkey', ['imgCode'], { unique: true })
@Entity('vehicle_files', { schema: 'transport' })
export class VehicleFile {
    @Column('character varying', { primary: true, name: 'img_code', length: 50 })
    imgCode: string;

    @Column('smallint', { name: 'position', nullable: true })
    position: number | null;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    @Column('int4', { name: 'id_vehicle' })
    idVehicle: number;

    /**
     *  Creation user
     */
    @ManyToOne(
        () => User,
        user => user.vehicleFilesCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    /**
     *  Vehicle of this file
     */
    @ManyToOne(
        () => Vehicle,
        vehicles => vehicles.vehicleFiles
    )
    @JoinColumn([{ name: 'id_vehicle', referencedColumnName: 'id' }])
    vehicle: Vehicle;

    /**
     * File of this vehicleFile
     */
    @OneToOne(
        () => File,
        files => files.vehicleFiles
    )
    @JoinColumn([{ name: 'img_code', referencedColumnName: 'name' }])
    file: File;
}
