import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { CandidateEntity } from "./candidate.entity";

@Entity("candidate_history")
export class CandidateHistoryEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	candidateId: string;

	@Column()
	action: string;

	@Column({ nullable: true })
	description?: string;

	@Column({ nullable: true })
	changedBy?: string;

	@Column({
		type: "enum",
		enum: ["active", "hired", "rejected", "withdrawn"],
		nullable: true,
	})
	previousStatus?: "active" | "hired" | "rejected" | "withdrawn";

	@Column({
		type: "enum",
		enum: ["active", "hired", "rejected", "withdrawn"],
		nullable: true,
	})
	newStatus?: "active" | "hired" | "rejected" | "withdrawn";

	@ManyToOne(() => CandidateEntity, (candidate) => candidate.history)
	@JoinColumn({ name: "candidate_id" })
	candidate: CandidateEntity;

	@CreateDateColumn()
	createdAt: Date;
}
