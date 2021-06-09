import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ServiceFiles } from "./ServiceFiles";
import { ServiceProposals } from "./ServiceProposals";
import { Users } from "./Users";
import { Vehicles } from "./Vehicles";
import { MeasurementUnits } from "./MeasurementUnits";

@Index("services_pkey", ["id"], { unique: true })
@Entity("services", { schema: "transport" })
export class Services {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "origin_address", length: 500 })
  originAddress: string;

  @Column("jsonb", { name: "origin_coordinates" })
  originCoordinates: object;

  @Column("character varying", { name: "destination_address", length: 500 })
  destinationAddress: string;

  @Column("jsonb", { name: "destination_coordinates" })
  destinationCoordinates: object;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("character varying", { name: "type", length: 255 })
  type: string;

  @Column("integer", { name: "packages", default: () => "0" })
  packages: number;

  @Column("integer", { name: "passengers", default: () => "0" })
  passengers: number;

  @Column("integer", { name: "bags", default: () => "0" })
  bags: number;

  @Column("numeric", {
    name: "weight",
    precision: 24,
    scale: 10,
    default: () => "0"
  })
  weight: string;

  @Column("character varying", { name: "distance", length: 50 })
  distance: string;

  @Column("character varying", { name: "duration", length: 50 })
  duration: string;

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
    () => ServiceFiles,
    serviceFiles => serviceFiles.idService
  )
  serviceFiles: ServiceFiles[];

  @OneToMany(
    () => ServiceProposals,
    serviceProposals => serviceProposals.idService2
  )
  serviceProposals: ServiceProposals[];

  @ManyToOne(
    () => Users,
    users => users.services
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Vehicles,
    vehicles => vehicles.services
  )
  @JoinColumn([{ name: "id_vehicle", referencedColumnName: "id" }])
  idVehicle: Vehicles;

  @ManyToOne(
    () => Users,
    users => users.services2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @ManyToOne(
    () => MeasurementUnits,
    measurementUnits => measurementUnits.services
  )
  @JoinColumn([{ name: "weight_unit", referencedColumnName: "id" }])
  weightUnit: MeasurementUnits;
}
