import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Locations } from "./Locations";
import { Users } from "./Users";
import { States } from "./States";

@Index("municipalities_pkey", ["id"], { unique: true })
@Index("municipalities_id_state_name_key", ["idState", "name"], {
  unique: true
})
@Entity("municipalities", { schema: "system" })
export class Municipalities {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("integer", { name: "id_state", unique: true })
  idState: number;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @Column("timestamp without time zone", {
    name: "modification_date",
    nullable: true
  })
  modificationDate: Date | null;

  @OneToMany(
    () => Locations,
    locations => locations.idMunicipality2
  )
  locations: Locations[];

  @ManyToOne(
    () => Users,
    users => users.municipalities
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => States,
    states => states.municipalities
  )
  @JoinColumn([{ name: "id_state", referencedColumnName: "id" }])
  idState2: States;

  @ManyToOne(
    () => Users,
    users => users.municipalities2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => Users,
    users => users.idMunicipality
  )
  users: Users[];
}
