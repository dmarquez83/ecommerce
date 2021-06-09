import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne
} from 'typeorm';
import { File, TransportService, User } from '.';

@Index('service_files_pkey', ['imgCode'], { unique: true })
@Entity('service_files', { schema: 'transport' })
export class ServiceFile {
    @Column('character varying', { primary: true, name: 'img_code', length: 50 })
    imgCode: string;

    @Column('smallint', { name: 'position', nullable: true })
    position: number | null;

    @Column('timestamp without time zone', {
        name: 'creation_date',
        default: () => 'CURRENT_TIMESTAMP'
    })
    creationDate: Date;

    @ManyToOne(
        () => User,
        users => users.serviceFilesCreated
    )
    @JoinColumn([{ name: 'creation_user', referencedColumnName: 'id' }])
    creationUser: User;

    @ManyToOne(
        () => TransportService,
        services => services.serviceFiles
    )
    @JoinColumn([{ name: 'id_service', referencedColumnName: 'id' }])
    idService: TransportService;

    @OneToOne(
        () => File,
        files => files.serviceFiles
    )
    @JoinColumn([{ name: 'img_code', referencedColumnName: 'name' }])
    file: File;
}
