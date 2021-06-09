import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Index("devices_pkey", ["token"], { unique: true })
@Entity("devices", { schema: "system" })
export class Devices {
  @Column("character varying", { name: "id_project", length: 400 })
  idProject: string;

  @Column("character varying", { primary: true, name: "token", length: 400 })
  token: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.devices
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.devices2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser: Users;
}
