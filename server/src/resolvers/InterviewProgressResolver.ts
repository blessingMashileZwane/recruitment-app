import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { InterviewProgressEntity } from "../entities";
import { DataSource } from "typeorm";
import { InterviewStatus } from "../types";

@Resolver(() => InterviewProgressEntity)
export class InterviewProgressResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => [InterviewProgressEntity])
	async interviewProgress(): Promise<InterviewProgressEntity[]> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		return repository.find({
			relations: ["candidate", "jobApplication", "stage"],
		});
	}

	@Query(() => InterviewProgressEntity, { nullable: true })
	async interviewProgressById(
		@Arg("id", () => ID) id: string
	): Promise<InterviewProgressEntity | null> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		return repository.findOne({
			where: { id },
			relations: ["candidate", "jobApplication", "stage"],
		});
	}

	@Mutation(() => InterviewProgressEntity)
	async createInterviewProgress(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("jobApplicationId", () => ID) jobApplicationId: string,
		@Arg("stageId", () => ID) stageId: string
	): Promise<InterviewProgressEntity> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		const progress = repository.create({
			candidateId,
			jobApplicationId,
			stageId,
			status: InterviewStatus.PENDING,
		});
		return repository.save(progress);
	}

	@Mutation(() => InterviewProgressEntity)
	async updateInterviewProgress(
		@Arg("id", () => ID) id: string,
		@Arg("stageId", () => ID, { nullable: true }) stageId?: string,
		@Arg("status", () => InterviewStatus, { nullable: true })
		status?: InterviewStatus,
		@Arg("scheduledDate", { nullable: true }) scheduledDate?: Date
	): Promise<InterviewProgressEntity> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		const progress = await repository.findOneOrFail({ where: { id } });

		if (stageId) progress.stageId = stageId;
		if (status) progress.status = status;

		return repository.save(progress);
	}

	@Query(() => [InterviewProgressEntity])
	async getInterviewProgressByCandidate(
		@Arg("candidateId", () => ID) candidateId: string
	): Promise<InterviewProgressEntity[]> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		return repository.find({
			where: { candidateId },
			relations: ["candidate", "jobApplication", "stage"],
		});
	}

	@Query(() => [InterviewProgressEntity])
	async getInterviewProgressByJobApplication(
		@Arg("jobApplicationId", () => ID) jobApplicationId: string
	): Promise<InterviewProgressEntity[]> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		return repository.find({
			where: { jobApplicationId },
			relations: ["candidate", "jobApplication", "stage"],
		});
	}

	@Mutation(() => Boolean)
	async deleteInterviewProgress(
		@Arg("id", () => ID) id: string
	): Promise<boolean> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		await repository.delete(id);
		return true;
	}
}
