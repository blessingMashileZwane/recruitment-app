import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { JobPositionEntity } from "./jobPosition.entity";

@Entity("job_position_history")
export class JobPositionHistoryEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	jobPositionId: string;

	@Column()
	action: string;

	@Column({ type: "text", nullable: true })
	description?: string;

	@Column({ nullable: true })
	changedBy?: string;

	@Column({ nullable: true })
	previousTitle?: string;

	@Column({ nullable: true })
	newTitle?: string;

	@Column({ nullable: true })
	previousDepartment?: string;

	@Column({ nullable: true })
	newDepartment?: string;

	@Column({ type: "text", nullable: true })
	previousDescription?: string;

	@Column({ type: "text", nullable: true })
	newDescription?: string;

	@Column({ type: "text", nullable: true })
	previousRequirements?: string;

	@Column({ type: "text", nullable: true })
	newRequirements?: string;
	@Column({ nullable: true })
	previousIsActive?: boolean;

	@Column({ nullable: true })
	newIsActive?: boolean;

	@ManyToOne(() => JobPositionEntity, (position) => position.history)
	@JoinColumn({ name: "job_position_id" })
	jobPosition: JobPositionEntity;

	@CreateDateColumn()
	createdAt: Date;
}
