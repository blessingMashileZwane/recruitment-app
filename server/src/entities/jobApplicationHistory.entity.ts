import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { JobApplicationEntity } from "./jobApplication.entity";
import { AppliedJob, AppliedJobStatus } from "../types";

registerEnumType(AppliedJob, {
	name: "AppliedJob",
	description: "The job positions a candidate can apply for",
});

registerEnumType(AppliedJobStatus, {
	name: "AppliedJobStatus",
	description: "The status of a job application",
});

@ObjectType()
@Entity("job_application_history")
export class JobApplicationHistoryEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	jobApplicationId: string;

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
	@Field()
	@Column()
	action: string;

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

	@ManyToOne(() => JobApplicationEntity, (application) => application.history)
	@JoinColumn({ name: "job_application_id" })
	jobApplication: JobApplicationEntity;

	@CreateDateColumn()
	@Field()
	createdAt: Date;

	@Field()
	@Column({ nullable: true })
	createdBy: String;
}
