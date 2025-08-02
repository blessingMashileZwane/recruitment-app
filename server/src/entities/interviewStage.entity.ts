import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany,
	UpdateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { InterviewProgressEntity } from "./interviewProgress.entity";
import { InterviewStageHistoryEntity } from "./interviewStageHistory.entity";

@ObjectType()
@Entity("interview_stages")
export class InterviewStageEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	name: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	description?: string;

	@Field()
	@Column()
	feedback: string;

	@Field(() => [InterviewProgressEntity])
	@OneToMany(() => InterviewProgressEntity, (progress) => progress.stage)
	interviewProgress: InterviewProgressEntity[];

	@Field(() => [InterviewStageHistoryEntity])
	@OneToMany(() => InterviewStageHistoryEntity, (history) => history.stage)
	history: InterviewStageHistoryEntity[];

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@Field()
	@Column({ nullable: true })
	createdBy: string;

	@Field()
	@UpdateDateColumn()
	updatedAt: Date;

	@Field()
	@Column({ nullable: true })
	updatedBy: string;
}
