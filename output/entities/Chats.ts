import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ChatMessages } from "./ChatMessages";
import { Users } from "./Users";

@Index(
  "chats_creation_user_id_offer_id_exchange_key",
  ["creationUser", "idExchange", "idOffer"],
  { unique: true }
)
@Index("chats_pkey", ["id"], { unique: true })
@Entity("chats", { schema: "public" })
export class Chats {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_exchange", nullable: true, unique: true })
  idExchange: string | null;

  @Column("bigint", { name: "id_offer", nullable: true, unique: true })
  idOffer: string | null;

  @Column("character varying", { name: "user_status", length: 100 })
  userStatus: string;

  @Column("character varying", { name: "provider_status", length: 100 })
  providerStatus: string;

  @Column("bigint", { name: "creation_user", unique: true })
  creationUser: string;

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
    () => ChatMessages,
    chatMessages => chatMessages.idChat2
  )
  chatMessages: ChatMessages[];

  @ManyToOne(
    () => Users,
    users => users.chats
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser2: Users;

  @ManyToOne(
    () => Users,
    users => users.chats2
  )
  @JoinColumn([{ name: "id_exchange", referencedColumnName: "id" }])
  idExchange2: Users;

  @ManyToOne(
    () => Users,
    users => users.chats3
  )
  @JoinColumn([{ name: "id_offer", referencedColumnName: "id" }])
  idOffer2: Users;

  @ManyToOne(
    () => Users,
    users => users.chats4
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
