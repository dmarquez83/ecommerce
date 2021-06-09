import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { AnswerVotes } from "./AnswerVotes";
import { Users } from "./Users";
import { Products } from "./Products";

@Index("answers_to_questions_pkey", ["id"], { unique: true })
@Entity("answers_to_questions", { schema: "public" })
export class AnswersToQuestions {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("text", { name: "aswer" })
  aswer: string;

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
    () => AnswerVotes,
    answerVotes => answerVotes.idAnswer2
  )
  answerVotes: AnswerVotes[];

  @ManyToOne(
    () => Users,
    users => users.answersToQuestions
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Products,
    products => products.answersToQuestions
  )
  @JoinColumn([{ name: "id_product", referencedColumnName: "id" }])
  idProduct: Products;

  @ManyToOne(
    () => Users,
    users => users.answersToQuestions2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
