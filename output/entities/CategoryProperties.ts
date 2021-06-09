import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Categories } from "./Categories";
import { Properties } from "./Properties";

@Index("category_properties_pkey", ["idCategory", "idProperty"], {
  unique: true
})
@Entity("category_properties", { schema: "system" })
export class CategoryProperties {
  @Column("integer", { primary: true, name: "id_category" })
  idCategory: number;

  @Column("bigint", { primary: true, name: "id_property" })
  idProperty: string;

  @Column("boolean", { name: "main", default: () => "false" })
  main: boolean;

  @Column("boolean", { name: "disabled", default: () => "false" })
  disabled: boolean;

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
    users => users.categoryProperties
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Categories,
    categories => categories.categoryProperties
  )
  @JoinColumn([{ name: "id_category", referencedColumnName: "id" }])
  idCategory2: Categories;

  @ManyToOne(
    () => Properties,
    properties => properties.categoryProperties
  )
  @JoinColumn([{ name: "id_property", referencedColumnName: "id" }])
  idProperty2: Properties;

  @ManyToOne(
    () => Users,
    users => users.categoryProperties2
  )
  @JoinColumn([{ name: "modification_user", referencedColumnName: "id" }])
  modificationUser: Users;
}
