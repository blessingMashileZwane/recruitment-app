import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToMany,
	ManyToOne,
	OneToOne,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { CandidateHistoryEntity } from "./candidateHistory.entity";
import { CandidateSkillEntity } from "./candidateSkill.entity";
import { JobApplicationEntity } from "./jobApplication.entity";
import { CandidateStatus } from "../types";

registerEnumType(CandidateStatus, {
	name: "CandidateStatus",
	description: "The status of a candidate in the recruitment process",
});

@ObjectType()
@Entity("candidate")
export class CandidateEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

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

	@Field(() => JobApplicationEntity)
	@OneToOne(() => JobApplicationEntity)
	@JoinColumn()
	jobApplication: JobApplicationEntity;

	@Field(() => CandidateSkillEntity)
	@OneToOne(() => CandidateSkillEntity)
	@JoinColumn()
	candidateSkill: CandidateSkillEntity;

	@Field({ nullable: true })
	@Column({ nullable: true })
	resumeUrl?: string;

	@OneToMany(() => CandidateHistoryEntity, (history) => history.candidate)
	history: CandidateHistoryEntity[];

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@Column({ nullable: true })
	createdBy: String;

	@Field()
	@UpdateDateColumn()
	updatedAt: Date;

	@Field()
	@Column({ nullable: true })
	updatedBy: String;
}
