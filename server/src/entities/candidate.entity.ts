import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
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
	UpdateDateColumn,
} from "typeorm";
import { userContext } from "../middleware";
import { CandidateStatus } from "../types";
import { CandidateHistoryEntity } from "./candidateHistory.entity";
import { CandidateSkillEntity } from "./candidateSkill.entity";
import { JobApplicationEntity } from "./jobApplication.entity";

registerEnumType(CandidateStatus, {
	name: "CandidateStatus",
	description: "The status of a candidate in the recruitment process",
});

@ObjectType()
@Entity("candidate")
export class CandidateEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	firstName: string;

	@Field()
	@Column()
	lastName: string;

	@Field()
	@Column({ unique: true })
	email: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	phone?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	currentLocation?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	citizenship?: string;

	@Field(() => CandidateStatus)
	@Column({
		type: "enum",
		enum: CandidateStatus,
		default: CandidateStatus.OPEN,
	})
	status: CandidateStatus;

	@Field(() => [JobApplicationEntity])
	@OneToMany(() => JobApplicationEntity, (application) => application.candidate)
	jobApplications: JobApplicationEntity[];

	@Field(() => CandidateSkillEntity)
	@OneToOne(() => CandidateSkillEntity)
	@JoinColumn()
	candidateSkill: CandidateSkillEntity;

	@Field({ nullable: true })
	@Column({ nullable: true })
	resumeUrl?: string;

	@OneToMany(() => CandidateHistoryEntity, (history) => history.candidate)
	history: CandidateHistoryEntity[];

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@Column({ nullable: true })
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
