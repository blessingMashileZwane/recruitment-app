import { Field, ID, ObjectType } from "type-graphql";
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	RelationId,
	UpdateDateColumn,
} from "typeorm";
import { userContext } from "../middleware";
import { CandidateEntity } from "./candidate.entity";
import { CandidateSkillHistoryEntity } from "./candidateSkillHistory.entity";

@ObjectType()
@Entity("candidate_skills")
export class CandidateSkillEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@RelationId(
		(candidateSkill: CandidateSkillEntity) => candidateSkill.candidate
	)
	candidateId: string;

	@Field()
	@Column()
	university: string;

	@Field()
	@Column()
	qualification: string;

	@Field()
	@Column()
	yearsOfExperience: number;

	@Field({ nullable: true })
	@Column({ nullable: true })
	proficiencyLevel?: number;

	@Field({ nullable: true })
	@Column({ nullable: true })
	possessedSkills?: string;

	@Field(() => CandidateEntity)
	@OneToOne(() => CandidateEntity, (candidate) => candidate.candidateSkill)
	@JoinColumn({ name: "candidate_id" })
	candidate: CandidateEntity;

	@Field(() => [CandidateSkillHistoryEntity])
	@OneToMany(
		() => CandidateSkillHistoryEntity,
		(history) => history.candidateSkill
	)
	history: CandidateSkillHistoryEntity[];

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@Column()
	createdBy: string;

	@Field()
	@UpdateDateColumn()
	updatedAt: Date;

	@Field()
	@Column()
	updatedBy: string;

	@BeforeInsert()
	setAuditFieldsOnInsert() {
		const ctx = userContext.getStore();
		const userId = ctx?.userId ?? "system";
		this.createdBy = userId;
		this.updatedBy = userId;
	}

	@BeforeUpdate()
	setAuditFieldsOnUpdate() {
		const ctx = userContext.getStore();
		const userId = ctx?.userId ?? "system";
		this.updatedBy = userId;
	}
}
