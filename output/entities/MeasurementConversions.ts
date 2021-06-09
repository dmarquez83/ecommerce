import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { MeasurementUnits } from "./MeasurementUnits";

@Index("measurement_conversions_pkey", ["idFrom", "idTo"], { unique: true })
@Entity("measurement_conversions", { schema: "system" })
export class MeasurementConversions {
  @Column("integer", { primary: true, name: "id_from" })
  idFrom: number;

  @Column("integer", { primary: true, name: "id_to" })
  idTo: number;

  @Column("numeric", { name: "factor", precision: 24, scale: 10 })
  factor: string;

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
    users => users.measurementConversions
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => MeasurementUnits,
    measurementUnits => measurementUnits.measurementConversions
  )
  @JoinColumn([{ name: "id_from", referencedColumnName: "id" }])
  idFrom2: MeasurementUnits;

  @ManyToOne(
    () => MeasurementUnits,
    measurementUnits => measurementUnits.measurementConversions2
  )
  @JoinColumn([{ name: "id_to", referencedColumnName: "id" }])
  idTo2: MeasurementUnits;

  @ManyToOne(
    () => Users,
    users => users.measurementConversions2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
