import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany,
} from "typeorm";
import { InterviewProgressEntity } from "./interviewProgress.entity";
import { InterviewStageHistoryEntity } from "./interviewStageHistory.entity";

@Entity("interview_stages")
export class InterviewStageEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@Column({ type: "text", nullable: true })
	description?: string;

	@Column()
	orderIndex: number;

	@OneToMany(() => InterviewProgressEntity, (progress) => progress.stage)
	interviewProgress: InterviewProgressEntity[];

	@OneToMany(() => InterviewStageHistoryEntity, (history) => history.stage)
	history: InterviewStageHistoryEntity[];

	@CreateDateColumn()
	createdAt: Date;
}
