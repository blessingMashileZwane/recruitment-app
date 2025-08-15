import { Field, ID, ObjectType } from "type-graphql";
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { CandidateEntity } from "./candidate.entity";
import { CandidateSkillHistoryEntity } from "./candidateSkillHistory.entity";
import { userContext } from "../middleware";

@ObjectType()
@Entity("candidate_skills")
export class CandidateSkillEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
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

	@Field()
	@Column()
	proficiencyLevel: number;

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
