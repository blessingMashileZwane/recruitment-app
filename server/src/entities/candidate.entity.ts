import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { InterviewProgressEntity } from "./interviewProgress.entity";
import { CandidateHistoryEntity } from "./candidateHistory.entity";
import { CandidateSkillEntity } from "./candidateSkill.entity";
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

	@Field({ nullable: true })
	@Column({ nullable: true })
	resumeUrl?: string;

	@Field(() => [CandidateSkillEntity])
	@OneToMany(
		() => CandidateSkillEntity,
		(candidateSkill) => candidateSkill.candidate
	)
	candidateSkills: CandidateSkillEntity[];

	@OneToMany(() => InterviewProgressEntity, (progress) => progress.candidate)
	interviewProgress: InterviewProgressEntity[];

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
