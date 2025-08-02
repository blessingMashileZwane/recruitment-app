import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { InterviewProgressEntity, InterviewStatus } from "../entities";
import { DataSource } from "typeorm";

@Resolver(() => InterviewProgressEntity)
export class InterviewProgressResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => [InterviewProgressEntity])
	async interviewProgress(): Promise<InterviewProgressEntity[]> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		return repository.find({
			relations: ["candidate", "jobPosition", "stage"],
		});
	}

	@Query(() => InterviewProgressEntity, { nullable: true })
	async interviewProgressById(
		@Arg("id", () => ID) id: string
	): Promise<InterviewProgressEntity | null> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		return repository.findOne({
			where: { id },
			relations: ["candidate", "jobPosition", "stage"],
		});
	}

	@Mutation(() => InterviewProgressEntity)
	async createInterviewProgress(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("jobPositionId", () => ID) jobPositionId: string,
		@Arg("stageId", () => ID) stageId: string,
		@Arg("scheduledDate", { nullable: true }) scheduledDate?: Date,
		@Arg("feedback", { nullable: true }) feedback?: string,
		@Arg("score", { nullable: true }) score?: number
	): Promise<InterviewProgressEntity> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		const progress = repository.create({
			candidateId,
			jobPositionId,
			stageId,
			status: InterviewStatus.PENDING,
			scheduledDate,
			feedback,
			score,
		});
		return repository.save(progress);
	}

	@Mutation(() => InterviewProgressEntity)
	async updateInterviewProgress(
		@Arg("id", () => ID) id: string,
		@Arg("stageId", () => ID, { nullable: true }) stageId?: string,
		@Arg("status", () => InterviewStatus, { nullable: true })
		status?: InterviewStatus,
		@Arg("scheduledDate", { nullable: true }) scheduledDate?: Date,
		@Arg("feedback", { nullable: true }) feedback?: string,
		@Arg("score", { nullable: true }) score?: number
	): Promise<InterviewProgressEntity> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		const progress = await repository.findOneOrFail({ where: { id } });

		if (stageId) progress.stageId = stageId;
		if (status) progress.status = status;
		if (scheduledDate !== undefined) progress.scheduledDate = scheduledDate;
		if (feedback !== undefined) progress.feedback = feedback;
		if (score !== undefined) progress.score = score;

		return repository.save(progress);
	}

	@Query(() => [InterviewProgressEntity])
	async getInterviewProgressByCandidate(
		@Arg("candidateId", () => ID) candidateId: string
	): Promise<InterviewProgressEntity[]> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		return repository.find({
			where: { candidateId },
			relations: ["candidate", "jobPosition", "stage"],
		});
	}

	@Query(() => [InterviewProgressEntity])
	async getInterviewProgressByJobPosition(
		@Arg("jobPositionId", () => ID) jobPositionId: string
	): Promise<InterviewProgressEntity[]> {
		const repository = this.dataSource.getRepository(InterviewProgressEntity);
		return repository.find({
			where: { jobPositionId },
			relations: ["candidate", "jobPosition", "stage"],
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
