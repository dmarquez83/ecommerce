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
import { Files } from "./Files";
import { Vehicles } from "./Vehicles";

@Index("vehicle_brands_pkey", ["id"], { unique: true })
@Index("vehicle_brands_name_key", ["name"], { unique: true })
@Entity("vehicle_brands", { schema: "system" })
export class VehicleBrands {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

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

  @ManyToOne(
    () => Users,
    users => users.vehicleBrands
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Files,
    files => files.vehicleBrands
  )
  @JoinColumn([{ name: "img_code", referencedColumnName: "name" }])
  imgCode: Files;

  @ManyToOne(
    () => Users,
    users => users.vehicleBrands2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => Vehicles,
    vehicles => vehicles.idBrand
  )
  vehicles: Vehicles[];
}
