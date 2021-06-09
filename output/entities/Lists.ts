import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Characteristics } from "./Characteristics";
import { ListOptions } from "./ListOptions";
import { Users } from "./Users";

@Index("lists_pkey", ["id"], { unique: true })
@Index("lists_name_key", ["name"], { unique: true })
@Entity("lists", { schema: "system" })
export class Lists {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("boolean", { name: "measure", default: () => "false" })
  measure: boolean;

  @Column("boolean", { name: "editable", default: () => "true" })
  editable: boolean;

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
    () => Characteristics,
    characteristics => characteristics.idList
  )
  characteristics: Characteristics[];

  @OneToMany(
    () => ListOptions,
    listOptions => listOptions.idList2
  )
  listOptions: ListOptions[];

  @ManyToOne(
    () => Users,
    users => users.lists
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.lists2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
