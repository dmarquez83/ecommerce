import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Lists } from "./Lists";
import { MeasurementUnits } from "./MeasurementUnits";

@Index("list_options_pkey", ["idList", "value"], { unique: true })
@Entity("list_options", { schema: "system" })
export class ListOptions {
  @Column("integer", { primary: true, name: "id_list" })
  idList: number;

  @Column("character varying", { primary: true, name: "value", length: 255 })
  value: string;

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
    users => users.listOptions
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Lists,
    lists => lists.listOptions
  )
  @JoinColumn([{ name: "id_list", referencedColumnName: "id" }])
  idList2: Lists;

  @ManyToOne(
    () => MeasurementUnits,
    measurementUnits => measurementUnits.listOptions
  )
  @JoinColumn([{ name: "id_measurement_unit", referencedColumnName: "id" }])
  idMeasurementUnit: MeasurementUnits;

  @ManyToOne(
    () => Users,
    users => users.listOptions2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
