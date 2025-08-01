import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
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

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	description?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	changedBy?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	previousYearsOfExperience?: number;

	@Field({ nullable: true })
	@Column({ nullable: true })
	newYearsOfExperience?: number;

	@Field({ nullable: true })
	@Column({ nullable: true })
	previousProficiencyLevel?: number;

	@Field({ nullable: true })
	@Column({ nullable: true })
	newProficiencyLevel?: number;

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
}
