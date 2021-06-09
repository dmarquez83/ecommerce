import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { BankAccounts } from "./BankAccounts";
import { Users } from "./Users";

@Index("banks_code_key", ["code"], { unique: true })
@Index("banks_pkey", ["id"], { unique: true })
@Index("banks_name_key", ["name"], { unique: true })
@Entity("banks", { schema: "financial" })
export class Banks {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "code", unique: true, length: 4 })
  code: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

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
    () => BankAccounts,
    bankAccounts => bankAccounts.idBank
  )
  bankAccounts: BankAccounts[];

  @ManyToOne(
    () => Users,
    users => users.banks
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.banks2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
