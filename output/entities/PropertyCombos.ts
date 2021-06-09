import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";
import { Properties } from "./Properties";

@Index("idx_property_combos_characteristics", ["characteristics"], {})
@Index("property_combos_pkey", ["id"], { unique: true })
@Entity("property_combos", { schema: "public" })
export class PropertyCombos {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("jsonb", { name: "characteristics" })
  characteristics: object;

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
    users => users.propertyCombos
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Properties,
    properties => properties.propertyCombos
  )
  @JoinColumn([{ name: "id_property", referencedColumnName: "id" }])
  idProperty: Properties;

  @ManyToOne(
    () => Users,
    users => users.propertyCombos2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
