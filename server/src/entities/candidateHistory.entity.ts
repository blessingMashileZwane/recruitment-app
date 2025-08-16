import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	BeforeInsert,
	BeforeUpdate,
} from "typeorm";
import { CandidateEntity } from "./candidate.entity";
import { Field, registerEnumType } from "type-graphql";
import { CandidateStatus } from "../types";
import { userContext } from "../middleware";

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
	@Column()
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

	@Field({ nullable: true })
	@Column({ nullable: true })
	resumeUrl?: string;

	@Field(() => CandidateStatus)
	@Column({
		type: "enum",
		enum: CandidateStatus,
		default: CandidateStatus.OPEN,
	})
	status: CandidateStatus;

	@ManyToOne(() => CandidateEntity, (candidate) => candidate.history)
	@JoinColumn({ name: "candidate_id" })
	candidate: CandidateEntity;

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@Column()
	createdBy: string;

	@BeforeInsert()
	setAuditFieldsOnInsert() {
		const ctx = userContext.getStore();
		const userId = ctx?.userId ?? "system";
		this.createdBy = userId;
	}
}
