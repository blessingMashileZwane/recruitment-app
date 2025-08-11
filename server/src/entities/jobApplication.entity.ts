import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	OneToOne,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { JobApplicationHistoryEntity } from "./jobApplicationHistory.entity";
import { InterviewStageEntity } from "./interviewStage.entity";
import { AppliedJob, AppliedJobStatus } from "../types";
import { CandidateEntity } from "./candidate.entity";

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
	@Column()
	title: string;

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
	@Column({ nullable: true })
	department?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	description?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	requirements?: string;

	@Field()
	@Column({ default: true })
	isActive: boolean;

	@Field(() => CandidateEntity)
	@ManyToOne(() => CandidateEntity, (candidate) => candidate.jobApplications)
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
	createdBy: String;

	@Field()
	@UpdateDateColumn()
	updatedAt: Date;

	@Field()
	@Column({ nullable: true })
	updatedBy: String;
}
