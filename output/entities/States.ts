import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Municipalities } from "./Municipalities";
import { Users } from "./Users";

@Index("states_pkey", ["id"], { unique: true })
@Index("states_name_key", ["name"], { unique: true })
@Entity("states", { schema: "system" })
export class States {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

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
    () => Municipalities,
    municipalities => municipalities.idState2
  )
  municipalities: Municipalities[];

  @ManyToOne(
    () => Users,
    users => users.states
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.states2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
