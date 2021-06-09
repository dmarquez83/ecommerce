import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Characteristics } from "./Characteristics";
import { Properties } from "./Properties";

@Index("property_characteristics_pkey", ["idCharacteristic", "idProperty"], {
  unique: true
})
@Entity("property_characteristics", { schema: "system" })
export class PropertyCharacteristics {
  @Column("bigint", { primary: true, name: "id_property" })
  idProperty: string;

  @Column("integer", { primary: true, name: "id_characteristic" })
  idCharacteristic: number;

  @Column("boolean", { name: "main", default: () => "false" })
  main: boolean;

  @Column("boolean", { name: "disabled", default: () => "false" })
  disabled: boolean;

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
    users => users.propertyCharacteristics
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Characteristics,
    characteristics => characteristics.propertyCharacteristics
  )
  @JoinColumn([{ name: "id_characteristic", referencedColumnName: "id" }])
  idCharacteristic2: Characteristics;

  @ManyToOne(
    () => Properties,
    properties => properties.propertyCharacteristics
  )
  @JoinColumn([{ name: "id_property", referencedColumnName: "id" }])
  idProperty2: Properties;

  @ManyToOne(
    () => Users,
    users => users.propertyCharacteristics2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
