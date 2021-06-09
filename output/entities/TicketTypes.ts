import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";
import { Tickets } from "./Tickets";

@Index("ticket_types_code_key", ["code"], { unique: true })
@Index("ticket_types_pkey", ["id"], { unique: true })
@Index("ticket_types_name_key", ["name"], { unique: true })
@Entity("ticket_types", { schema: "system" })
export class TicketTypes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", unique: true, length: 10 })
  code: string;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("text", { name: "description" })
  description: string;

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

  @ManyToOne(
    () => Users,
    users => users.ticketTypes
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.ticketTypes2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => Tickets,
    tickets => tickets.idTicketType
  )
  tickets: Tickets[];
}
