import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { InterviewStageEntity } from "../entities";
import { DataSource } from "typeorm";

@Resolver(() => InterviewStageEntity)
export class InterviewStageResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => [InterviewStageEntity])
	async interviewStages(): Promise<InterviewStageEntity[]> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		return repository.find();
	}

	@Query(() => InterviewStageEntity, { nullable: true })
	async interviewStage(
		@Arg("id", () => ID) id: string
	): Promise<InterviewStageEntity | null> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		return repository.findOne({ where: { id } });
	}

	@Mutation(() => InterviewStageEntity)
	async createInterviewStage(
		@Arg("name") name: string,
		@Arg("feedback") feedback: string,
		@Arg("description", { nullable: true }) description?: string
	): Promise<InterviewStageEntity> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const stage = repository.create({ name, feedback, description });
		return repository.save(stage);
	}

	@Mutation(() => InterviewStageEntity)
	async updateInterviewStage(
		@Arg("id", () => ID) id: string,
		@Arg("name", { nullable: true }) name?: string,
		@Arg("feedback", { nullable: true }) feedback?: string,
		@Arg("description", { nullable: true }) description?: string
	): Promise<InterviewStageEntity> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const stage = await repository.findOneOrFail({ where: { id } });

		if (name) stage.name = name;
		if (feedback !== undefined) stage.feedback = feedback;
		if (description !== undefined) stage.description = description;

		return repository.save(stage);
	}

	@Mutation(() => Boolean)
	async deleteInterviewStage(
		@Arg("id", () => ID) id: string
	): Promise<boolean> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		await repository.delete(id);
		return true;
	}
}
