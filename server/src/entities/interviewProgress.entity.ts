import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { CandidateEntity } from "./candidate.entity";
import { InterviewProgressHistoryEntity } from "./interviewProgressHistory.entity";
import { JobPositionEntity } from "./jobPosition.entity";
import { InterviewStageEntity } from "./interviewStage.entity";

export enum InterviewStatus {
	SCHEDULED = "scheduled",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
	PENDING = "pending",
}

registerEnumType(InterviewStatus, {
	name: "InterviewStatus",
	description: "The status of an interview",
});

@ObjectType()
@Entity("interview_progress")
export class InterviewProgressEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	candidateId: string;

	@Field()
	@Column()
	jobPositionId: string;

	@Field()
	@Column()
	stageId: string;

	@Field(() => CandidateEntity)
	@ManyToOne(() => CandidateEntity, (candidate) => candidate.interviewProgress)
	@JoinColumn({ name: "candidate_id" })
	candidate: CandidateEntity;

	@Field(() => JobPositionEntity)
	@ManyToOne(() => JobPositionEntity, (position) => position.interviewProgress)
	@JoinColumn({ name: "job_position_id" })
	jobPosition: JobPositionEntity;

	@Field(() => InterviewStageEntity)
	@ManyToOne(() => InterviewStageEntity, (stage) => stage.interviewProgress)
	@JoinColumn({ name: "stage_id" })
	stage: InterviewStageEntity;

	@Field(() => [InterviewProgressHistoryEntity])
	@OneToMany(
		() => InterviewProgressHistoryEntity,
		(history) => history.interviewProgress
	)
	history: InterviewProgressHistoryEntity[];

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
	feedback?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	score?: number;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@UpdateDateColumn()
	updatedAt: Date;
}
