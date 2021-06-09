import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "./Users";
import { Offers } from "./Offers";
import { OfferReviews } from "./OfferReviews";

@Index("idx_offer_acquisitions_date", ["creationDate"], {})
@Index("offer_acquisitions_pkey", ["id"], { unique: true })
@Entity("offer_acquisitions", { schema: "public" })
export class OfferAcquisitions {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "status", length: 100 })
  status: string;

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
    users => users.offerAcquisitions
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Offers,
    offers => offers.offerAcquisitions
  )
  @JoinColumn([{ name: "id_offer", referencedColumnName: "id" }])
  idOffer: Offers;

  @ManyToOne(
    () => Users,
    users => users.offerAcquisitions2
  )
  @JoinColumn([{ name: "id_user", referencedColumnName: "id" }])
  idUser: Users;

  @ManyToOne(
    () => Users,
    users => users.offerAcquisitions3
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;

  @OneToOne(
    () => OfferReviews,
    offerReviews => offerReviews.idOfferAcquisition2
  )
  offerReviews: OfferReviews;
}
