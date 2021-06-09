import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne
} from "typeorm";
import { Users } from "./Users";
import { Services } from "./Services";
import { Files } from "./Files";

@Index("service_files_pkey", ["imgCode"], { unique: true })
@Entity("service_files", { schema: "transport" })
export class ServiceFiles {
  @Column("character varying", { primary: true, name: "img_code", length: 50 })
  imgCode: string;

  @Column("smallint", { name: "position", nullable: true })
  position: number | null;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.serviceFiles
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Services,
    services => services.serviceFiles
  )
  @JoinColumn([{ name: "id_service", referencedColumnName: "id" }])
  idService: Services;

  @OneToOne(
    () => Files,
    files => files.serviceFiles
  )
  @JoinColumn([{ name: "img_code", referencedColumnName: "name" }])
  imgCode2: Files;
}
