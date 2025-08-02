import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { InterviewProgressEntity } from "./interviewProgress.entity";
import { InterviewStageEntity } from "./interviewStage.entity";
import { InterviewStatus } from "./interviewProgress.entity";

@ObjectType()
@Entity("interview_progress_history")
export class InterviewProgressHistoryEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	interviewProgressId: string;

	@Field(() => InterviewStatus, { nullable: true })
	@Field(() => InterviewStatus, { nullable: true })
	@Column({
		type: "enum",
		enum: InterviewStatus,
		enumName: "interview_status",
		nullable: true,
	})
	previousStatus?: InterviewStatus;

	@Field(() => InterviewStatus, { nullable: true })
	@Column({
		type: "enum",
		enum: InterviewStatus,
		enumName: "interview_status",
		nullable: true,
	})
	newStatus?: InterviewStatus;

	@Field({ nullable: true })
	@Column({ nullable: true })
	previousStageId?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	newStageId?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	changedBy?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	notes?: string;

	@Field(() => InterviewProgressEntity)
	@ManyToOne(() => InterviewProgressEntity, (progress) => progress.history)
	@JoinColumn({ name: "interview_progress_id" })
	interviewProgress: InterviewProgressEntity;

	@Field(() => InterviewStageEntity)
	@ManyToOne(() => InterviewStageEntity)
	@JoinColumn({ name: "previous_stage_id" })
	previousStage?: InterviewStageEntity;

	@Field(() => InterviewStageEntity, { nullable: true })
	@ManyToOne(() => InterviewStageEntity)
	@JoinColumn({ name: "new_stage_id" })
	newStage?: InterviewStageEntity;

	@Field()
	@CreateDateColumn()
	createdAt: Date;
}
