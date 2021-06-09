import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Index("idx_audits_changes", ["changes"], {})
@Index("idx_date", ["creationDate"], {})
@Index("idx_audits", ["primaryKey", "tableName"], {})
@Index("idx_audits_key", ["primaryKey"], {})
@Entity("audits", { schema: "system" })
export class Audits {
  @Column("character varying", { name: "table_name", length: 50 })
  tableName: string;

  @Column("character varying", { name: "table_action", length: 50 })
  tableAction: string;

  @Column("jsonb", { name: "primary_key" })
  primaryKey: object;

  @Column("jsonb", { name: "changes" })
  changes: object;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.audits
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;
}
