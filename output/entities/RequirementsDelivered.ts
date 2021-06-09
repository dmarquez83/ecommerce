import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Businesses } from "./Businesses";
import { RequirementTypes } from "./RequirementTypes";
import { Users } from "./Users";

@Index("requirements_delivered_pkey", ["id"], { unique: true })
@Entity("requirements_delivered", { schema: "system" })
export class RequirementsDelivered {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("bigint", { name: "id_requirement" })
  idRequirement: string;

  @Column("text", { name: "url" })
  url: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("bigint", { name: "creation_user" })
  creationUser: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @Column("bigint", { name: "modification_user", nullable: true })
  modificationUser: string | null;

  @Column("timestamp without time zone", {
    name: "modification_date",
    nullable: true
  })
  modificationDate: Date | null;

  @ManyToOne(
    () => Businesses,
    businesses => businesses.requirementsDelivereds
  )
  @JoinColumn([{ name: "id_business", referencedColumnName: "id" }])
  idBusiness: Businesses;

  @ManyToOne(
    () => RequirementTypes,
    requirementTypes => requirementTypes.requirementsDelivereds
  )
  @JoinColumn([{ name: "id_requirement_type", referencedColumnName: "id" }])
  idRequirementType: RequirementTypes;

  @ManyToOne(
    () => Users,
    users => users.requirementsDelivereds
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser: Users;
}
