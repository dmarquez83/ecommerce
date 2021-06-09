import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Chats } from "./Chats";

@Index("chat_messages_pkey", ["creationDate", "idChat", "transmitter"], {
  unique: true
})
@Entity("chat_messages", { schema: "public" })
export class ChatMessages {
  @Column("bigint", { primary: true, name: "id_chat" })
  idChat: string;

  @Column("character varying", {
    primary: true,
    name: "transmitter",
    length: 50
  })
  transmitter: string;

  @Column("character varying", { name: "user_status", length: 100 })
  userStatus: string;

  @Column("character varying", { name: "provider_status", length: 100 })
  providerStatus: string;

  @Column("text", { name: "message" })
  message: string;

  @Column("timestamp without time zone", {
    primary: true,
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.chatMessages
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Chats,
    chats => chats.chatMessages
  )
  @JoinColumn([{ name: "id_chat", referencedColumnName: "id" }])
  idChat2: Chats;
}
