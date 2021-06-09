import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";
import { Lists } from "./Lists";
import { PropertyCharacteristics } from "./PropertyCharacteristics";

@Index("characteristics_pkey", ["id"], { unique: true })
@Index("characteristics_name_system_key", ["name", "system"], { unique: true })
@Entity("characteristics", { schema: "system" })
export class Characteristics {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "label", length: 255 })
  label: string;

  @Column("character varying", { name: "data_type", length: 50 })
  dataType: string;

  @Column("boolean", { name: "unit_required", default: () => "false" })
  unitRequired: boolean;

  @Column("boolean", { name: "system", unique: true, default: () => "true" })
  system: boolean;

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

  @ManyToOne(
    () => Users,
    users => users.characteristics
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Lists,
    lists => lists.characteristics
  )
  @JoinColumn([{ name: "id_list", referencedColumnName: "id" }])
  idList: Lists;

  @ManyToOne(
    () => Users,
    users => users.characteristics2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => PropertyCharacteristics,
    propertyCharacteristics => propertyCharacteristics.idCharacteristic2
  )
  propertyCharacteristics: PropertyCharacteristics[];
}
