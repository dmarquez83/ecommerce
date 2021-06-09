import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Index("refresh_tokens_pkey", ["idUser", "token"], { unique: true })
@Entity("refresh_tokens", { schema: "system" })
export class RefreshTokens {
  @Column("bigint", { primary: true, name: "id_user" })
  idUser: string;

  @Column("character varying", { primary: true, name: "token", length: 400 })
  token: string;

  @Column("character varying", { name: "refresh", length: 400 })
  refresh: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.refreshTokens
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser2: Users;
}
