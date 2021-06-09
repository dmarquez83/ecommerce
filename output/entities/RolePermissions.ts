import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Permissions } from "./Permissions";
import { Roles } from "./Roles";

@Index("role_permissions_pkey", ["idPermission", "idRole"], { unique: true })
@Entity("role_permissions", { schema: "system" })
export class RolePermissions {
  @Column("integer", { primary: true, name: "id_role" })
  idRole: number;

  @Column("integer", { primary: true, name: "id_permission" })
  idPermission: number;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.rolePermissions
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Permissions,
    permissions => permissions.rolePermissions
  )
  @JoinColumn([{ name: "id_permission", referencedColumnName: "id" }])
  idPermission2: Permissions;

  @ManyToOne(
    () => Roles,
    roles => roles.rolePermissions
  )
  @JoinColumn([{ name: "id_role", referencedColumnName: "id" }])
  idRole2: Roles;
}
