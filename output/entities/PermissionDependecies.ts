import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Permissions } from "./Permissions";

@Index("permission_dependecies_pkey", ["idDependecy", "idPermission"], {
  unique: true
})
@Entity("permission_dependecies", { schema: "system" })
export class PermissionDependecies {
  @Column("integer", { primary: true, name: "id_permission" })
  idPermission: number;

  @Column("integer", { primary: true, name: "id_dependecy" })
  idDependecy: number;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.permissionDependecies
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Permissions,
    permissions => permissions.permissionDependecies
  )
  @JoinColumn([{ name: "id_dependecy", referencedColumnName: "id" }])
  idDependecy2: Permissions;

  @ManyToOne(
    () => Permissions,
    permissions => permissions.permissionDependecies2
  )
  @JoinColumn([{ name: "id_permission", referencedColumnName: "id" }])
  idPermission2: Permissions;
}
