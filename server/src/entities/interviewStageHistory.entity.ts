import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { InterviewStageEntity } from "./interviewStage.entity";

@Entity("interview_stage_history")
export class InterviewStageHistoryEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	stageId: string;

	@Column()
	action: string;

	@Column({ type: "text", nullable: true })
	description?: string;

	@Column({ nullable: true })
	changedBy?: string;

	@Column({ nullable: true })
	previousName?: string;

	@Column({ nullable: true })
	newName?: string;

	@Column({ type: "text", nullable: true })
	previousDescription?: string;

	@Column({ type: "text", nullable: true })
	newDescription?: string;

	@Column({ nullable: true })
	previousOrderIndex?: number;

	@Column({ nullable: true })
	newOrderIndex?: number;

	@ManyToOne(() => InterviewStageEntity, (stage) => stage.history)
	@JoinColumn({ name: "stage_id" })
	stage: InterviewStageEntity;

	@CreateDateColumn()
	createdAt: Date;
}
