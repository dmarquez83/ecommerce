import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { File, User } from '.';
import { Vehicle } from './vehicle.entity';

@Index('vehicle_brands_pkey', ['id'], { unique: true })
@Index('vehicle_brands_name_key', ['name'], { unique: true })
@Entity('vehicle_brands', { schema: 'system' })
export class VehicleBrand {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', { name: 'name', unique: true, length: 255 })
    name: string;

    @Column('character varying', { name: 'status', length: 100, select: false })
    status: string;

    @Column('character varying', { name: 'img_code' })
    imgCode: string;

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
        user => user.vehicleBrandsCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => User,
        user => user.vehicleBrandsModified
    )
    @JoinColumn([{ name: 'modification_user', referencedColumnName: 'id' }])
    modificationUser: User;

    /**
     *  Image associate of this brand
     */
    @ManyToOne(
        () => File,
        file => file.vehicleBrands
    )
    @JoinColumn([{ name: 'img_code', referencedColumnName: 'name' }])
    imgCodeFile: File;

    /**
     *  Vehicles of this brand
     */
    @OneToMany(
        () => Vehicle,
        vehicles => vehicles.brand
    )
    vehicles: Vehicle[];

}
