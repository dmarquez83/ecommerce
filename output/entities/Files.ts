import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne
} from "typeorm";
import { Businesses } from "./Businesses";
import { Users } from "./Users";
import { ProductFiles } from "./ProductFiles";
import { ServiceFiles } from "./ServiceFiles";
import { VehicleBrands } from "./VehicleBrands";
import { VehicleFiles } from "./VehicleFiles";

@Index("files_pkey", ["name"], { unique: true })
@Index("idx_files_tagas", ["tags"], {})
@Entity("files", { schema: "system" })
export class Files {
  @Column("character varying", { primary: true, name: "name", length: 50 })
  name: string;

  @Column("character varying", { name: "extension", length: 10 })
  extension: string;

  @Column("character varying", { name: "origin", length: 50 })
  origin: string;

  @Column("text", { name: "url" })
  url: string;

  @Column("jsonb", { name: "tags", nullable: true })
  tags: object | null;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @OneToMany(
    () => Businesses,
    businesses => businesses.imgCode
  )
  businesses: Businesses[];

  @ManyToOne(
    () => Users,
    users => users.files
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @OneToOne(
    () => ProductFiles,
    productFiles => productFiles.imgCode2
  )
  productFiles: ProductFiles;

  @OneToOne(
    () => ServiceFiles,
    serviceFiles => serviceFiles.imgCode2
  )
  serviceFiles: ServiceFiles;

  @OneToMany(
    () => Users,
    users => users.imgCode
  )
  users: Users[];

  @OneToMany(
    () => VehicleBrands,
    vehicleBrands => vehicleBrands.imgCode
  )
  vehicleBrands: VehicleBrands[];

  @OneToOne(
    () => VehicleFiles,
    vehicleFiles => vehicleFiles.imgCode2
  )
  vehicleFiles: VehicleFiles;
}
