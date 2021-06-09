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
import { CategoryProperties } from "./CategoryProperties";
import { CategoryWords } from "./CategoryWords";
import { Exchanges } from "./Exchanges";
import { Offers } from "./Offers";
import { Products } from "./Products";

@Index("categories_pkey", ["id"], { unique: true })
@Index("categories_name_id_parent_key", ["idParent", "name"], { unique: true })
@Entity("categories", { schema: "system" })
export class Categories {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("integer", { name: "id_parent", nullable: true, unique: true })
  idParent: number | null;

  @Column("character varying", {
    name: "type",
    length: 50,
    default: () => "'Products'"
  })
  type: string;

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

  @ManyToOne(
    () => Users,
    users => users.categories
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Categories,
    categories => categories.categories
  )
  @JoinColumn([{ name: "id_parent", referencedColumnName: "id" }])
  idParent2: Categories;

  @OneToMany(
    () => Categories,
    categories => categories.idParent2
  )
  categories: Categories[];

  @ManyToOne(
    () => Users,
    users => users.categories2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => CategoryProperties,
    categoryProperties => categoryProperties.idCategory2
  )
  categoryProperties: CategoryProperties[];

  @OneToMany(
    () => CategoryWords,
    categoryWords => categoryWords.idCategory2
  )
  categoryWords: CategoryWords[];

  @OneToMany(
    () => Exchanges,
    exchanges => exchanges.idCategory
  )
  exchanges: Exchanges[];

  @OneToMany(
    () => Offers,
    offers => offers.idCategory
  )
  offers: Offers[];

  @OneToMany(
    () => Products,
    products => products.idCategory
  )
  products: Products[];
}
