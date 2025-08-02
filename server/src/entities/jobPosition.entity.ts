import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { InterviewProgressEntity } from "./interviewProgress.entity";
import { JobPositionHistoryEntity } from "./jobPositionHistory.entity";

@ObjectType()
@Entity("job_positions")
export class JobPositionEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	title: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	department?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	description?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	requirements?: string;

	@Field()
	@Column({ default: true })
	isActive: boolean;

	@Field(() => [InterviewProgressEntity])
	@OneToMany(() => InterviewProgressEntity, (progress) => progress.jobPosition)
	interviewProgress: InterviewProgressEntity[];

	@Field(() => [JobPositionHistoryEntity])
	@OneToMany(() => JobPositionHistoryEntity, (history) => history.jobPosition)
	history: JobPositionHistoryEntity[];

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@UpdateDateColumn()
	updatedAt: Date;
}
