import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Questions } from "./Questions";

@Index("question_votes_pkey", ["creationUser", "idQuestion"], { unique: true })
@Entity("question_votes", { schema: "public" })
export class QuestionVotes {
  @Column("bigint", { primary: true, name: "id_question" })
  idQuestion: string;

  @Column("boolean", { name: "vote" })
  vote: boolean;

  @Column("bigint", { primary: true, name: "creation_user" })
  creationUser: string;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.questionVotes
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser2: Users;

  @ManyToOne(
    () => Questions,
    questions => questions.questionVotes
  )
  @JoinColumn([{ name: "id_question", referencedColumnName: "id" }])
  idQuestion2: Questions;
}
