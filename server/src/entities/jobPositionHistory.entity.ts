import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { JobPositionEntity } from "./jobPosition.entity";

@ObjectType()
@Entity("job_position_history")
export class JobPositionHistoryEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column()
	jobPositionId: string;

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
	previousTitle?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	newTitle?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	previousDepartment?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	newDepartment?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	previousDescription?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	newDescription?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	previousRequirements?: string;

	@Field({ nullable: true })
	@Column({ type: "text", nullable: true })
	newRequirements?: string;
	@Column({ nullable: true })
	previousIsActive?: boolean;

	@Column({ nullable: true })
	newIsActive?: boolean;

	@ManyToOne(() => JobPositionEntity, (position) => position.history)
	@JoinColumn({ name: "job_position_id" })
	jobPosition: JobPositionEntity;

	@CreateDateColumn()
	createdAt: Date;
}
