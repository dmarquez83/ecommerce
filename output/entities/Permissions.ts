import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { PermissionDependecies } from "./PermissionDependecies";
import { Users } from "./Users";
import { RolePermissions } from "./RolePermissions";

@Index("permissions_code_key", ["code"], { unique: true })
@Index("permissions_pkey", ["id"], { unique: true })
@Index("permissions_name_type_key", ["name", "type"], { unique: true })
@Entity("permissions", { schema: "system" })
export class Permissions {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", unique: true, length: 10 })
  code: string;

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
    () => PermissionDependecies,
    permissionDependecies => permissionDependecies.idDependecy2
  )
  permissionDependecies: PermissionDependecies[];

  @OneToMany(
    () => PermissionDependecies,
    permissionDependecies => permissionDependecies.idPermission2
  )
  permissionDependecies2: PermissionDependecies[];

  @ManyToOne(
    () => Users,
    users => users.permissions
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.permissions2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => RolePermissions,
    rolePermissions => rolePermissions.idPermission2
  )
  rolePermissions: RolePermissions[];
}
