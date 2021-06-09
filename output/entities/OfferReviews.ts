import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne
} from "typeorm";
import { Users } from "./Users";
import { OfferAcquisitions } from "./OfferAcquisitions";

@Index("offer_reviews_pkey", ["idOfferAcquisition"], { unique: true })
@Entity("offer_reviews", { schema: "public" })
export class OfferReviews {
  @Column("bigint", { primary: true, name: "id_offer_acquisition" })
  idOfferAcquisition: string;

  @Column("text", { name: "review" })
  review: string;

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

  @ManyToOne(
    () => Users,
    users => users.offerReviews
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @OneToOne(
    () => OfferAcquisitions,
    offerAcquisitions => offerAcquisitions.offerReviews
  )
  @JoinColumn([{ name: "id_offer_acquisition", referencedColumnName: "id" }])
  idOfferAcquisition2: OfferAcquisitions;

  @ManyToOne(
    () => Users,
    users => users.offerReviews2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
