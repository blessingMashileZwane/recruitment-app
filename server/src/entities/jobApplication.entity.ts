import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	OneToOne,
	BeforeInsert,
	BeforeUpdate,
	RelationId,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { JobApplicationHistoryEntity } from "./jobApplicationHistory.entity";
import { InterviewStageEntity } from "./interviewStage.entity";
import { AppliedJob, AppliedJobStatus } from "../types";
import { CandidateEntity } from "./candidate.entity";
import { userContext } from "../middleware";

registerEnumType(AppliedJob, {
	name: "AppliedJob",
	description: "The job positions a candidate can apply for",
});

registerEnumType(AppliedJobStatus, {
	name: "AppliedJobStatus",
	description: "The status of a job application",
});

@ObjectType()
@Entity("job_applications")
export class JobApplicationEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@RelationId(
		(jobApplication: JobApplicationEntity) => jobApplication.candidate
	)
	candidateId: string;

	@Field(() => AppliedJob)
	@Column({
		type: "enum",
		enum: AppliedJob,
		default: AppliedJob.OTHER,
	})
	appliedJob: AppliedJob;

	@Field(() => AppliedJobStatus)
	@Column({
		type: "enum",
		enum: AppliedJobStatus,
		default: AppliedJobStatus.ACTIVE,
	})
	applicationStatus: AppliedJobStatus;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	appliedJobOther?: string;

	@Field()
	@Column({ default: true })
	isActive: boolean;

	@Field(() => CandidateEntity)
	@ManyToOne(() => CandidateEntity, (candidate) => candidate.jobApplications)
	@JoinColumn({ name: "candidate_id" })
	candidate: CandidateEntity;

	@Field(() => [InterviewStageEntity])
	@OneToMany(() => InterviewStageEntity, (stage) => stage.jobApplication)
	interviewStages: InterviewStageEntity[];

	@Field(() => [JobApplicationHistoryEntity])
	@OneToMany(
		() => JobApplicationHistoryEntity,
		(history) => history.jobApplication
	)
	history: JobApplicationHistoryEntity[];

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
	@Column({ nullable: true })
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
