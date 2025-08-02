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
import { JobApplicationEntity } from "./jobApplication.entity";
import { InterviewStageEntity } from "./interviewStage.entity";
import { InterviewStatus } from "../types";

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
	jobApplicationId: string;

	@Field()
	@Column()
	stageId: string;

	@Field(() => InterviewStatus)
	@Column({ type: "enum", enum: InterviewStatus })
	status: InterviewStatus;

	@Field(() => CandidateEntity)
	@ManyToOne(() => CandidateEntity, (candidate) => candidate.interviewProgress)
	@JoinColumn({ name: "candidate_id" })
	candidate: CandidateEntity;

	@Field(() => JobApplicationEntity)
	@ManyToOne(
		() => JobApplicationEntity,
		(application) => application.interviewProgress
	)
	@JoinColumn({ name: "job_application_id" })
	jobApplication: JobApplicationEntity;

	@Field(() => [InterviewStageEntity])
	@OneToMany(() => InterviewStageEntity, (stage) => stage.interviewProgress)
	@JoinColumn({ name: "stage_id" })
	stage: InterviewStageEntity[];

	@Field(() => [InterviewProgressHistoryEntity])
	@OneToMany(
		() => InterviewProgressHistoryEntity,
		(history) => history.interviewProgress
	)
	history: InterviewProgressHistoryEntity[];

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
}
