import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { CandidateEntity } from "./candidate.entity";
import { SkillEntity } from "./skill.entity";
import { CandidateSkillHistoryEntity } from "./candidateSkillHistory.entity";

@ObjectType()
@Entity("candidate_skills")
export class CandidateSkillEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	candidateId: string;

	@Field()
	@Column()
	skillId: string;

	@Field()
	@Column()
	yearsOfExperience: number;

	@Field()
	@Column()
	proficiencyLevel: number;

	@Field(() => CandidateEntity)
	@ManyToOne(() => CandidateEntity, (candidate) => candidate.candidateSkills)
	@JoinColumn({ name: "candidate_id" })
	candidate: CandidateEntity;

	@Field(() => SkillEntity)
	@ManyToOne(() => SkillEntity, (skill) => skill.candidateSkills)
	@JoinColumn({ name: "skill_id" })
	skill: SkillEntity;

	@Field(() => [CandidateSkillHistoryEntity])
	@OneToMany(
		() => CandidateSkillHistoryEntity,
		(history) => history.candidateSkill
	)
	history: CandidateSkillHistoryEntity[];

	@Field()
	@CreateDateColumn()
	createdAt: Date;
}
