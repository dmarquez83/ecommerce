import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Services } from "./Services";
import { Vehicles } from "./Vehicles";

@Index("service_proposals_pkey", ["creationUser", "idService"], {
  unique: true
})
@Entity("service_proposals", { schema: "transport" })
export class ServiceProposals {
  @Column("bigint", { primary: true, name: "id_service" })
  idService: string;

  @Column("numeric", { name: "price", precision: 24, scale: 10 })
  price: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("bigint", { primary: true, name: "creation_user" })
  creationUser: string;

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
    users => users.serviceProposals
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser2: Users;

  @ManyToOne(
    () => Services,
    services => services.serviceProposals
  )
  @JoinColumn([{ name: "id_service", referencedColumnName: "id" }])
  idService2: Services;

  @ManyToOne(
    () => Vehicles,
    vehicles => vehicles.serviceProposals
  )
  @JoinColumn([{ name: "id_vehicle", referencedColumnName: "id" }])
  idVehicle: Vehicles;

  @ManyToOne(
    () => Users,
    users => users.serviceProposals2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
