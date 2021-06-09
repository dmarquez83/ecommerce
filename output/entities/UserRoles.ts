import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Roles } from "./Roles";

@Index("user_roles_pkey", ["idRole", "idUser"], { unique: true })
@Entity("user_roles", { schema: "system" })
export class UserRoles {
  @Column("bigint", { primary: true, name: "id_user" })
  idUser: string;

  @Column("integer", { primary: true, name: "id_role" })
  idRole: number;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.userRoles
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Roles,
    roles => roles.userRoles
  )
  @JoinColumn([{ name: "id_role", referencedColumnName: "id" }])
  idRole2: Roles;

  @ManyToOne(
    () => Users,
    users => users.userRoles2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser2: Users;
}
