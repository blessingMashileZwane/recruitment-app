import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany,
	UpdateDateColumn,
	ManyToOne,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { InterviewStageHistoryEntity } from "./interviewStageHistory.entity";
import { JobApplicationEntity } from "./jobApplication.entity";

@ObjectType()
@Entity("interview_stages")
export class InterviewStageEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	name: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	description?: string;

	@Field()
	@Column()
	feedback: string;

	@Field()
	@Column()
	interviewerName: string;

	@Field()
	@Column()
	rating: number;

	@Field()
	@Column()
	nextStepNotes: string;

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
	@Column({ nullable: true })
	createdBy: string;

	@Field()
	@UpdateDateColumn()
	updatedAt: Date;

	@Field()
	@Column({ nullable: true })
	updatedBy: string;
}
