import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";
import { TicketTypes } from "./TicketTypes";

@Index("tickets_pkey", ["id"], { unique: true })
@Entity("tickets", { schema: "public" })
export class Tickets {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("character varying", { name: "subject", length: 140 })
  subject: string;

  @Column("text", { name: "description" })
  description: string;

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
    users => users.tickets
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => TicketTypes,
    ticketTypes => ticketTypes.tickets
  )
  @JoinColumn([{ name: "id_ticket_type", referencedColumnName: "id" }])
  idTicketType: TicketTypes;

  @ManyToOne(
    () => Users,
    users => users.tickets2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
