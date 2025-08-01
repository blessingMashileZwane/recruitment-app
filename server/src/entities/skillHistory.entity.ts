import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { SkillEntity } from "./skill.entity";

@ObjectType()
@Entity("skill_history")
export class SkillHistoryEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	skillId: string;

	@Field()
	@Column()
	action: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	description?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	changedBy?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	previousName?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	newName?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	previousCategory?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	newCategory?: string;

	@Field(() => SkillEntity)
	@ManyToOne(() => SkillEntity, (skill) => skill.history)
	@JoinColumn({ name: "skill_id" })
	skill: SkillEntity;

	@Field()
	@CreateDateColumn()
	createdAt: Date;
}
