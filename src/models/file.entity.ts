import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ProductFile, User, VehicleBrand } from '.';
import { ServiceFile } from './serviceFile.entity';
import { VehicleFile } from './vehicleFile.entity';

@Index('files_pkey', ['name'], { unique: true })
@Entity('files', { schema: 'system' })
export class File {
    @Column('character varying', { primary: true, name: 'name', length: 50 })
    name: string;

    @Column('character varying', { name: 'extension', length: 10 })
    extension: string;

    @Column('character varying', { name: 'origin', length: 50 })
    origin: string;

    @Column('text', { name: 'url' })
    url: string;

    @Column('jsonb', { name: 'tags', nullable: true })
    tags: object | null;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP',
        select: false
    })
    creationDate: Date;

    /**
     *  User file upload
     */
    @ManyToOne(
        () => User,
        users => users.files
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    /**
     *  Files of the current product
     */
    @OneToMany(
        () => ProductFile,
        productFile => productFile.files
    )
    productFiles: ProductFile[];

    /*
     *  Vehicle brand associate of this file
     */
    @OneToMany(
        () => VehicleBrand,
        vehicleBrands => vehicleBrands.imgCodeFile
    )
    vehicleBrands: VehicleBrand[];

    /**
     * VehicleFiles associate of this file
     */
    @OneToOne(
        () => VehicleFile,
        vehicleFiles => vehicleFiles.file
    )
    vehicleFiles: VehicleFile;

    /**
     * Transport service of this file
     */
    @OneToOne(
        () => ServiceFile,
        serviceFiles => serviceFiles.file
    )
    serviceFiles: ServiceFile;
}
