import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Roles } from "./Roles";
import { Stores } from "./Stores";

@Index("user_store_roles_pkey", ["idRole", "idStore", "idUser"], {
  unique: true
})
@Entity("user_store_roles", { schema: "public" })
export class UserStoreRoles {
  @Column("bigint", { primary: true, name: "id_user" })
  idUser: string;

  @Column("integer", { primary: true, name: "id_role" })
  idRole: number;

  @Column("bigint", { primary: true, name: "id_store" })
  idStore: string;

  @Column("boolean", { name: "disabled", default: () => "false" })
  disabled: boolean;

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
    users => users.userStoreRoles
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Roles,
    roles => roles.userStoreRoles
  )
  @JoinColumn([{ name: "id_role", referencedColumnName: "id" }])
  idRole2: Roles;

  @ManyToOne(
    () => Stores,
    stores => stores.userStoreRoles
  )
  @JoinColumn([{ name: "id_store", referencedColumnName: "id" }])
  idStore2: Stores;

  @ManyToOne(
    () => Users,
    users => users.userStoreRoles2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser2: Users;

  @ManyToOne(
    () => Users,
    users => users.userStoreRoles3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
