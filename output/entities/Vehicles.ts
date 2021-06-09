import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ServiceProposals } from "./ServiceProposals";
import { Services } from "./Services";
import { VehicleFiles } from "./VehicleFiles";
import { Users } from "./Users";
import { VehicleBrands } from "./VehicleBrands";

@Index("vehicles_pkey", ["id"], { unique: true })
@Index("vehicles_plate_key", ["plate"], { unique: true })
@Index("vehicles_uq_idx", ["plate"], { unique: true })
@Entity("vehicles", { schema: "transport" })
export class Vehicles {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "model", length: 255 })
  model: string;

  @Column("character varying", { name: "color", length: 255 })
  color: string;

  @Column("character varying", { name: "plate", unique: true, length: 50 })
  plate: string;

  @Column("integer", { name: "seats" })
  seats: number;

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
    () => ServiceProposals,
    serviceProposals => serviceProposals.idVehicle
  )
  serviceProposals: ServiceProposals[];

  @OneToMany(
    () => Services,
    services => services.idVehicle
  )
  services: Services[];

  @OneToMany(
    () => VehicleFiles,
    vehicleFiles => vehicleFiles.idVehicle
  )
  vehicleFiles: VehicleFiles[];

  @ManyToOne(
    () => Users,
    users => users.vehicles
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => VehicleBrands,
    vehicleBrands => vehicleBrands.vehicles
  )
  @JoinColumn([{ name: "id_brand", referencedColumnName: "id" }])
  idBrand: VehicleBrands;

  @ManyToOne(
    () => Users,
    users => users.vehicles2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
