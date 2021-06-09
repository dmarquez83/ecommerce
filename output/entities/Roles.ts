import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { RolePermissions } from "./RolePermissions";
import { Users } from "./Users";
import { UserBusinessRoles } from "./UserBusinessRoles";
import { UserRoles } from "./UserRoles";

@Index("roles_pkey", ["id"], { unique: true })
@Index("roles_name_type_key", ["name", "type"], { unique: true })
@Entity("roles", { schema: "system" })
export class Roles {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("character varying", { name: "type", unique: true, length: 50 })
  type: string;

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
    () => RolePermissions,
    rolePermissions => rolePermissions.idRole2
  )
  rolePermissions: RolePermissions[];

  @ManyToOne(
    () => Users,
    users => users.roles
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.roles2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => UserBusinessRoles,
    userBusinessRoles => userBusinessRoles.idRole2
  )
  userBusinessRoles: UserBusinessRoles[];

  @OneToMany(
    () => UserRoles,
    userRoles => userRoles.idRole2
  )
  userRoles: UserRoles[];
}
