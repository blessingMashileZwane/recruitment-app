import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { InterviewProgressEntity } from "./interviewProgress.entity";
import { InterviewStatus } from "../types";

registerEnumType(InterviewStatus, {
	name: "InterviewStatus",
	description: "The status of an interview",
});

@ObjectType()
@Entity("interview_progress_history")
export class InterviewProgressHistoryEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	interviewProgressId: string;

	@Field()
	@Column()
	candidateId: string;

	@Field()
	@Column()
	jobApplicationId: string;

	@Field()
	@Column()
	stageId: string;

	@Field(() => InterviewStatus)
	@Column({
		type: "enum",
		enum: InterviewStatus,
		enumName: "interview_status",
		default: InterviewStatus.PENDING,
	})
	status: InterviewStatus;

	@Field({ nullable: true })
	@Column({ type: "timestamp", nullable: true })
	scheduledDate?: Date;

	@Field({ nullable: true })
	@Column({ nullable: true })
	score?: number;

	@Field(() => InterviewProgressEntity)
	@ManyToOne(() => InterviewProgressEntity, (progress) => progress.history)
	@JoinColumn({ name: "interview_progress_id" })
	interviewProgress: InterviewProgressEntity;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@Column({ nullable: true })
	createdBy: string;
}
