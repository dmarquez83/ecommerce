import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ListOptions } from "./ListOptions";
import { MeasurementConversions } from "./MeasurementConversions";
import { Users } from "./Users";
import { Services } from "./Services";

@Index("measurement_units_pkey", ["id"], { unique: true })
@Index("measurement_units_name_key", ["name"], { unique: true })
@Entity("measurement_units", { schema: "system" })
export class MeasurementUnits {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "type", length: 50 })
  type: string;

  @Column("character varying", { name: "symbol", length: 50 })
  symbol: string;

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
    () => ListOptions,
    listOptions => listOptions.idMeasurementUnit
  )
  listOptions: ListOptions[];

  @OneToMany(
    () => MeasurementConversions,
    measurementConversions => measurementConversions.idFrom2
  )
  measurementConversions: MeasurementConversions[];

  @OneToMany(
    () => MeasurementConversions,
    measurementConversions => measurementConversions.idTo2
  )
  measurementConversions2: MeasurementConversions[];

  @ManyToOne(
    () => Users,
    users => users.measurementUnits
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.measurementUnits2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => Services,
    services => services.weightUnit
  )
  services: Services[];
}
