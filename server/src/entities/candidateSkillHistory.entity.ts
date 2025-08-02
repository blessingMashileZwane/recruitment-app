import { Field, ID, ObjectType } from "type-graphql";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { CandidateSkillEntity } from "./candidateSkill.entity";

@ObjectType()
@Entity("candidate_skill_history")
export class CandidateSkillHistoryEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	candidateSkillId: string;

	@Field()
	@Column()
	action: string;

	@Field()
	@Column()
	university: string;

	@Field()
	@Column()
	qualification: string;

	@Field()
	@Column()
	yearsOfExperience: number;

	@Field()
	@Column()
	proficiencyLevel: number;

	@Field(() => CandidateSkillEntity)
	@ManyToOne(
		() => CandidateSkillEntity,
		(candidateSkill) => candidateSkill.history
	)
	@JoinColumn({ name: "candidate_skill_id" })
	candidateSkill: CandidateSkillEntity;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@Column()
	createdBy: string;
}
