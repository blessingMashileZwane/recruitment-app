import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { CandidateSkillEntity } from "./candidateSkill.entity";
import { SkillHistoryEntity } from "./skillHistory.entity";

@ObjectType()
@Entity("skills")
export class SkillEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column({ unique: true })
	name: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	category?: string;

	@Field(() => [CandidateSkillEntity])
	@OneToMany(
		() => CandidateSkillEntity,
		(candidateSkill) => candidateSkill.skill
	)
	candidateSkills: CandidateSkillEntity[];

	@Field(() => [SkillHistoryEntity])
	@OneToMany(() => SkillHistoryEntity, (history) => history.skill)
	history: SkillHistoryEntity[];

	@Field()
	@CreateDateColumn()
	createdAt: Date;
}
