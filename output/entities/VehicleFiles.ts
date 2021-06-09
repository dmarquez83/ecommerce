import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne
} from "typeorm";
import { Users } from "./Users";
import { Vehicles } from "./Vehicles";
import { Files } from "./Files";

@Index("vehicle_files_pkey", ["imgCode"], { unique: true })
@Entity("vehicle_files", { schema: "transport" })
export class VehicleFiles {
  @Column("character varying", { primary: true, name: "img_code", length: 50 })
  imgCode: string;

  @Column("smallint", { name: "position", nullable: true })
  position: number | null;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.vehicleFiles
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Vehicles,
    vehicles => vehicles.vehicleFiles
  )
  @JoinColumn([{ name: "id_vehicle", referencedColumnName: "id" }])
  idVehicle: Vehicles;

  @OneToOne(
    () => Files,
    files => files.vehicleFiles
  )
  @JoinColumn([{ name: "img_code", referencedColumnName: "name" }])
  imgCode2: Files;
}
