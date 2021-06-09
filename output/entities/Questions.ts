import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { QuestionVotes } from "./QuestionVotes";
import { Users } from "./Users";
import { Products } from "./Products";

@Index("questions_pkey", ["id"], { unique: true })
@Entity("questions", { schema: "public" })
export class Questions {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("text", { name: "question" })
  question: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

  @Column("smallint", { name: "score", default: () => "0" })
  score: number;

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
    () => QuestionVotes,
    questionVotes => questionVotes.idQuestion2
  )
  questionVotes: QuestionVotes[];

  @ManyToOne(
    () => Users,
    users => users.questions
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Products,
    products => products.questions
  )
  @JoinColumn([{ name: "id_product", referencedColumnName: "id" }])
  idProduct: Products;

  @ManyToOne(
    () => Users,
    users => users.questions2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
