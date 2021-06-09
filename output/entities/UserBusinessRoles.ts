import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Businesses } from "./Businesses";
import { Roles } from "./Roles";

@Index("user_business_roles_pkey", ["idBusiness", "idRole", "idUser"], {
  unique: true
})
@Entity("user_business_roles", { schema: "public" })
export class UserBusinessRoles {
  @Column("bigint", { primary: true, name: "id_user" })
  idUser: string;

  @Column("integer", { primary: true, name: "id_role" })
  idRole: number;

  @Column("bigint", { primary: true, name: "id_business" })
  idBusiness: string;

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
    users => users.userBusinessRoles
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Businesses,
    businesses => businesses.userBusinessRoles
  )
  @JoinColumn([{ name: "id_business", referencedColumnName: "id" }])
  idBusiness2: Businesses;

  @ManyToOne(
    () => Roles,
    roles => roles.userBusinessRoles
  )
  @JoinColumn([{ name: "id_role", referencedColumnName: "id" }])
  idRole2: Roles;

  @ManyToOne(
    () => Users,
    users => users.userBusinessRoles2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser2: Users;

  @ManyToOne(
    () => Users,
    users => users.userBusinessRoles3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
