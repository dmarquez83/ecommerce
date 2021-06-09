import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { CategoryProperties } from "./CategoryProperties";
import { Users } from "./Users";
import { PropertyCharacteristics } from "./PropertyCharacteristics";
import { PropertyCombos } from "./PropertyCombos";

@Index("properties_pkey", ["id"], { unique: true })
@Index("properties_name_type_key", ["name", "type"], { unique: true })
@Entity("properties", { schema: "system" })
export class Properties {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "type", unique: true, length: 50 })
  type: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 50
  })
  description: string | null;

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
    () => CategoryProperties,
    categoryProperties => categoryProperties.idProperty2
  )
  categoryProperties: CategoryProperties[];

  @ManyToOne(
    () => Users,
    users => users.properties
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.properties2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => PropertyCharacteristics,
    propertyCharacteristics => propertyCharacteristics.idProperty2
  )
  propertyCharacteristics: PropertyCharacteristics[];

  @OneToMany(
    () => PropertyCombos,
    propertyCombos => propertyCombos.idProperty
  )
  propertyCombos: PropertyCombos[];
}
