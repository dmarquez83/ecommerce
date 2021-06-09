import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { AnswersToQuestions } from "./AnswersToQuestions";

@Index("answer_votes_pkey", ["creationUser", "idAnswer"], { unique: true })
@Entity("answer_votes", { schema: "public" })
export class AnswerVotes {
  @Column("bigint", { primary: true, name: "id_answer" })
  idAnswer: string;

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
    users => users.answerVotes
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser2: Users;

  @ManyToOne(
    () => AnswersToQuestions,
    answersToQuestions => answersToQuestions.answerVotes
  )
  @JoinColumn([{ name: "id_answer", referencedColumnName: "id" }])
  idAnswer2: AnswersToQuestions;
}
