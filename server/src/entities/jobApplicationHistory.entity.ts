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
import { AppliedJob } from "../types";

registerEnumType(AppliedJob, {
	name: "AppliedJob",
	description: "The job positions a candidate can apply for",
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
	status: AppliedJob;

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
