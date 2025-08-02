import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { CandidateEntity } from "./candidate.entity";
import { Field, registerEnumType } from "type-graphql";
import { CandidateStatus } from "../types";

registerEnumType(CandidateStatus, {
	name: "CandidateStatus",
	description: "The status of a candidate in the recruitment process",
});

@Entity("candidate_history")
export class CandidateHistoryEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	candidateId: string;

	@Column()
	action: string;

	@Field()
	@Column()
	firstName: string;

	@Field()
	@Column()
	lastName: string;

	@Field()
	@Column({ unique: true })
	email: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	phone?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	currentLocation?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	citizenship?: string;

	@Field(() => CandidateStatus)
	@Column({
		type: "enum",
		enum: CandidateStatus,
		default: CandidateStatus.ACTIVE,
	})
	status: CandidateStatus;

	@Field({ nullable: true })
	@Column({ nullable: true })
	resumeUrl?: string;

	@ManyToOne(() => CandidateEntity, (candidate) => candidate.history)
	@JoinColumn({ name: "candidate_id" })
	candidate: CandidateEntity;

	@CreateDateColumn()
	createdAt: Date;

	@Column()
	createdBy: String;
}
