import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import { InterviewProgressEntity } from "./interviewProgress.entity";
import { JobPositionHistoryEntity } from "./jobPositionHistory.entity";

@Entity("job_positions")
export class JobPositionEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	title: string;

	@Column({ nullable: true })
	department?: string;

	@Column({ type: "text", nullable: true })
	description?: string;

	@Column({ type: "text", nullable: true })
	requirements?: string;

	@Column({ default: true })
	isActive: boolean;

	@OneToMany(() => InterviewProgressEntity, (progress) => progress.jobPosition)
	interviewProgress: InterviewProgressEntity[];

	@OneToMany(() => JobPositionHistoryEntity, (history) => history.jobPosition)
	history: JobPositionHistoryEntity[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
