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

@Index("buyer_levels_code_key", ["code"], { unique: true })
@Index("buyer_levels_pkey", ["id"], { unique: true })
@Index("buyer_levels_name_key", ["name"], { unique: true })
@Entity("buyer_levels", { schema: "system" })
export class BuyerLevels {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "code", unique: true, length: 10 })
  code: string;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("numeric", { name: "limit_amount", precision: 24, scale: 10 })
  limitAmount: string;

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
    users => users.buyerLevels
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => BuyerLevels,
    buyerLevels => buyerLevels.buyerLevels
  )
  @JoinColumn([{ name: "id_previous_level", referencedColumnName: "id" }])
  idPreviousLevel: BuyerLevels;

  @OneToMany(
    () => BuyerLevels,
    buyerLevels => buyerLevels.idPreviousLevel
  )
  buyerLevels: BuyerLevels[];

  @ManyToOne(
    () => Users,
    users => users.buyerLevels2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => Users,
    users => users.idBuyerLevel
  )
  users: Users[];
}
