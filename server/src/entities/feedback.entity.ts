import { ObjectType, Field, ID } from "type-graphql";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class FeedbackEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => ID)
	@Column()
	candidateId: string;

	@Field()
	@Column()
	interviewerName: string;

	@Field()
	@Column()
	interviewStep: string;

	@Field()
	@Column()
	rating: number;

	@Field()
	@Column("text")
	comments: string;

	@Field()
	@Column("text")
	nextStepNotes: string;

	@Field()
	@CreateDateColumn({ type: "date" })
	date: string;
}
