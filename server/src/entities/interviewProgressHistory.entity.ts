import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { InterviewProgressEntity } from "./interviewProgress.entity";
import { InterviewStageEntity } from "./interviewStage.entity";

@Entity("interview_progress_history")
export class InterviewProgressHistoryEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	interviewProgressId: string;

	@Column({
		type: "enum",
		enum: ["scheduled", "completed", "cancelled", "pending"],
		nullable: true,
	})
	previousStatus?: "scheduled" | "completed" | "cancelled" | "pending";

	@Column({
		type: "enum",
		enum: ["scheduled", "completed", "cancelled", "pending"],
		nullable: true,
	})
	newStatus?: "scheduled" | "completed" | "cancelled" | "pending";

	@Column({ nullable: true })
	previousStageId?: string;

	@Column({ nullable: true })
	newStageId?: string;

	@Column({ nullable: true })
	changedBy?: string;

	@Column({ type: "text", nullable: true })
	notes?: string;

	@ManyToOne(() => InterviewProgressEntity, (progress) => progress.history)
	@JoinColumn({ name: "interview_progress_id" })
	interviewProgress: InterviewProgressEntity;

	@ManyToOne(() => InterviewStageEntity)
	@JoinColumn({ name: "previous_stage_id" })
	previousStage?: InterviewStageEntity;

	@ManyToOne(() => InterviewStageEntity)
	@JoinColumn({ name: "new_stage_id" })
	newStage?: InterviewStageEntity;

	@CreateDateColumn()
	createdAt: Date;
}
