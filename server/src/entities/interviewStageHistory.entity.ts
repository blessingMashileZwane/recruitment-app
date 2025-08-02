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

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	description?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	changedBy?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	previousName?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	newName?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	previousDescription?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	newDescription?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	previousOrderIndex?: number;

	@Field({ nullable: true })
	@Column({ nullable: true })
	newOrderIndex?: number;

	@Field(() => InterviewStageEntity)
	@ManyToOne(() => InterviewStageEntity, (stage) => stage.history)
	@JoinColumn({ name: "stage_id" })
	stage: InterviewStageEntity;

	@Field()
	@CreateDateColumn()
	createdAt: Date;
}
