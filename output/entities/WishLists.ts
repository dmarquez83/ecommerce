import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { WishListProducts } from "./WishListProducts";
import { Users } from "./Users";

@Index("wish_lists_pkey", ["id"], { unique: true })
@Index("wish_lists_id_user_name_key", ["idUser", "name"], { unique: true })
@Entity("wish_lists", { schema: "public" })
export class WishLists {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_user", unique: true })
  idUser: string;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

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
    () => WishListProducts,
    wishListProducts => wishListProducts.idWishList2
  )
  wishListProducts: WishListProducts[];

  @ManyToOne(
    () => Users,
    users => users.wishLists
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Users,
    users => users.wishLists2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser2: Users;

  @ManyToOne(
    () => Users,
    users => users.wishLists3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
