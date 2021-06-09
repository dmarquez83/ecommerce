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
import { RequirementsPerType } from "./RequirementsPerType";

@Index("requirements_code_key", ["code"], { unique: true })
@Index("requirements_pkey", ["id"], { unique: true })
@Index("requirements_name_key", ["name"], { unique: true })
@Entity("requirements", { schema: "system" })
export class Requirements {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", unique: true, length: 10 })
  code: string;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("text", { name: "description" })
  description: string;

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
    users => users.requirements
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.requirements2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => RequirementsPerType,
    requirementsPerType => requirementsPerType.idRequirement2
  )
  requirementsPerTypes: RequirementsPerType[];
}
