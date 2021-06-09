import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";
import { Requirements } from "./Requirements";
import { RequirementTypes } from "./RequirementTypes";

@Index("requirements_per_type_pkey", ["idRequirement", "idRequirementType"], {
  unique: true
})
@Entity("requirements_per_type", { schema: "system" })
export class RequirementsPerType {
  @Column("integer", { primary: true, name: "id_requirement_type" })
  idRequirementType: number;

  @Column("integer", { primary: true, name: "id_requirement" })
  idRequirement: number;

  @Column("timestamp without time zone", {
    name: "creation_date",
    default: () => "CURRENT_TIMESTAMP"
  })
  creationDate: Date;

  @ManyToOne(
    () => Users,
    users => users.requirementsPerTypes
  )
  @JoinColumn([{ name: "creation_user", referencedColumnName: "id" }])
  creationUser: Users;

  @ManyToOne(
    () => Requirements,
    requirements => requirements.requirementsPerTypes
  )
  @JoinColumn([{ name: "id_requirement", referencedColumnName: "id" }])
  idRequirement2: Requirements;

  @ManyToOne(
    () => RequirementTypes,
    requirementTypes => requirementTypes.requirementsPerTypes
  )
  @JoinColumn([{ name: "id_requirement_type", referencedColumnName: "id" }])
  idRequirementType2: RequirementTypes;
}
