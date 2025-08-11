import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { InterviewStageEntity } from "./interviewStage.entity";

@ObjectType()
@Entity("interview_stage_history")
export class InterviewStageHistoryEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	stageId: string;

	@Field()
	@Column()
	action: string;

	@Field()
	@Column()
	name: string;

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

	@Field(() => InterviewStageEntity)
	@ManyToOne(() => InterviewStageEntity, (stage) => stage.history)
	@JoinColumn({ name: "stage_id" })
	stage: InterviewStageEntity;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@Column({ nullable: true })
	createdBy: string;
}
