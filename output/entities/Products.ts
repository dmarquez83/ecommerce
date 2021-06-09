import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { AnswersToQuestions } from "./AnswersToQuestions";
import { ProductFiles } from "./ProductFiles";
import { ProductReviews } from "./ProductReviews";
import { ProductStocks } from "./ProductStocks";
import { ProductVariations } from "./ProductVariations";
import { ProductWords } from "./ProductWords";
import { Users } from "./Users";
import { Businesses } from "./Businesses";
import { Categories } from "./Categories";
import { Questions } from "./Questions";

@Index("products_pkey", ["id"], { unique: true })
@Index("products_uq_idx", ["idBusiness"], { unique: true })
@Index("idx_product_property", ["properties"], {})
@Index("idx_product_images", ["properties"], {})
@Index("idx_product_tags", ["tags"], {})
@Entity("products", { schema: "public" })
export class Products {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "id_business" })
  idBusiness: string;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("character varying", { name: "sku", nullable: true, length: 50 })
  sku: string | null;

  @Column("jsonb", { name: "tags", nullable: true })
  tags: object | null;

  @Column("jsonb", { name: "properties", nullable: true })
  properties: object | null;

  @Column("character varying", { name: "brand", length: 255 })
  brand: string;

  @Column("numeric", { name: "length_value", precision: 24, scale: 10 })
  lengthValue: string;

  @Column("integer", { name: "length_unit" })
  lengthUnit: number;

  @Column("numeric", { name: "width_value", precision: 24, scale: 10 })
  widthValue: string;

  @Column("integer", { name: "width_unit" })
  widthUnit: number;

  @Column("numeric", { name: "weight_value", precision: 24, scale: 10 })
  weightValue: string;

  @Column("integer", { name: "weight_unit" })
  weightUnit: number;

  @Column("boolean", { name: "is_new", default: () => "true" })
  isNew: boolean;

  @Column("boolean", { name: "is_variant", default: () => "false" })
  isVariant: boolean;

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
    () => AnswersToQuestions,
    answersToQuestions => answersToQuestions.idProduct
  )
  answersToQuestions: AnswersToQuestions[];

  @OneToMany(
    () => ProductFiles,
    productFiles => productFiles.idProduct
  )
  productFiles: ProductFiles[];

  @OneToMany(
    () => ProductReviews,
    productReviews => productReviews.idProduct2
  )
  productReviews: ProductReviews[];

  @OneToMany(
    () => ProductStocks,
    productStocks => productStocks.idProduct2
  )
  productStocks: ProductStocks[];

  @OneToMany(
    () => ProductVariations,
    productVariations => productVariations.idProduct2
  )
  productVariations: ProductVariations[];

  @OneToMany(
    () => ProductWords,
    productWords => productWords.idProduct2
  )
  productWords: ProductWords[];

  @ManyToOne(
    () => Users,
    users => users.products
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @OneToOne(
    () => Businesses,
    businesses => businesses.products
  )
  @JoinColumn([{ name: "id_business", referencedColumnName: "id" }])
  idBusiness2: Businesses;

  @ManyToOne(
    () => Categories,
    categories => categories.products
  )
  @JoinColumn([{ name: "id_category", referencedColumnName: "id" }])
  idCategory: Categories;

  @ManyToOne(
    () => Users,
    users => users.products2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToMany(
    () => Questions,
    questions => questions.idProduct
  )
  questions: Questions[];
}
