import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { InterviewProgressEntity } from "./interviewProgress.entity";
import { JobApplicationHistoryEntity } from "./jobApplicationHistory.entity";
import { AppliedJob } from "../types";

registerEnumType(AppliedJob, {
	name: "AppliedJob",
	description: "The job positions a candidate can apply for",
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
	status: AppliedJob;

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

	@Field(() => [InterviewProgressEntity])
	@OneToMany(
		() => InterviewProgressEntity,
		(progress) => progress.jobApplication
	)
	interviewProgress: InterviewProgressEntity[];

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
