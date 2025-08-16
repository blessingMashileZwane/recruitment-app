import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany,
	UpdateDateColumn,
	ManyToOne,
	BeforeInsert,
	BeforeUpdate,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { InterviewStageHistoryEntity } from "./interviewStageHistory.entity";
import { JobApplicationEntity } from "./jobApplication.entity";
import { userContext } from "../middleware";

@ObjectType()
@Entity("interview_stages")
export class InterviewStageEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	name: string;

	@Field()
	@Column()
	feedback: string;

	@Field()
	@Column()
	rating: number;

	@Field()
	@Column()
	nextStepNotes: string;

	@Field()
	@Column()
	progressToNextStage: boolean;

	@Field(() => JobApplicationEntity)
	@ManyToOne(
		() => JobApplicationEntity,
		(jobApplication) => jobApplication.interviewStages
	)
	jobApplication: JobApplicationEntity;

	@Field(() => [InterviewStageHistoryEntity])
	@OneToMany(() => InterviewStageHistoryEntity, (history) => history.stage)
	history: InterviewStageHistoryEntity[];

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
