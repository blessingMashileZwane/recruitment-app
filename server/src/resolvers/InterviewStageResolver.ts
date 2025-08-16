import { HistoryService } from "./../utils/history.service";
import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { InterviewStageEntity, JobApplicationEntity } from "../entities";
import { DataSource } from "typeorm";
import { InterviewStageOutput } from "../types/outputs";
import { runTransaction } from "../utils";
import {
	CreateInterviewStageInput,
	UpdateInterviewStageInput,
} from "../types/inputs";

@Resolver(() => InterviewStageEntity)
export class InterviewStageResolver {
	private historyService: HistoryService;
	constructor(private dataSource: DataSource) {
		this.historyService = new HistoryService(this.dataSource);
	}

	@Query(() => [InterviewStageOutput])
	async interviewStages(): Promise<InterviewStageOutput[]> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		return repository.find({ relations: ["jobApplication", "history"] });
	}

	@Query(() => InterviewStageOutput, { nullable: true })
	async interviewStage(
		@Arg("id", () => ID) id: string
	): Promise<InterviewStageOutput | null> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		return repository.findOne({
			where: { id },
			relations: ["jobApplication"],
		});
	}

	@Query(() => [InterviewStageOutput])
	async getInterviewStagesByJobId(
		@Arg("jobApplicationId", () => ID) jobApplicationId: string
	): Promise<InterviewStageOutput[] | null> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const res = await repository.find({
			where: { jobApplication: { id: jobApplicationId } },
			relations: ["jobApplication", "history"],
		});
		return res;
	}

	@Mutation(() => InterviewStageOutput)
	async addInterviewStageToJob(
		@Arg("input") input: CreateInterviewStageInput
	): Promise<InterviewStageOutput> {
		const jobApplicationRepo =
			this.dataSource.getRepository(JobApplicationEntity);
		const jobApplication = await jobApplicationRepo.findOneOrFail({
			where: { id: input.jobApplicationId },
		});

		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const stage = repository.create({
			name: input.name,
			feedback: input.feedback,
			rating: input.rating,
			nextStepNotes: input.nextStepNotes,
			progressToNextStage: input.progressToNextStage,
			jobApplication,
		});

		return runTransaction(this.dataSource, async (manager) => {
			const savedStage = await manager.save(stage);
			await this.historyService.createHistoryRecord(
				savedStage,
				"InterviewStageEntity",
				"CREATE",
				manager
			);
			return savedStage;
		});
	}

	@Mutation(() => InterviewStageOutput)
	async updateInterviewStage(
		@Arg("input") input: UpdateInterviewStageInput
	): Promise<InterviewStageOutput> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const stage = await repository.findOneOrFail({
			where: { id: input.id },
		});

		if (input.name !== undefined) stage.name = input.name;
		if (input.feedback !== undefined) stage.feedback = input.feedback;
		if (input.rating !== undefined) stage.rating = input.rating;
		if (input.nextStepNotes !== undefined)
			stage.nextStepNotes = input.nextStepNotes;

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(stage);
			await this.historyService.createHistoryRecord(
				stage,
				"InterviewStageEntity",
				"UPDATE",
				manager
			);
			return response;
		});
	}

	@Mutation(() => Boolean)
	async deleteInterviewStage(
		@Arg("id", () => ID) id: string
	): Promise<boolean> {
		return runTransaction(this.dataSource, async (manager) => {
			await manager.delete(InterviewStageEntity, id);
			await this.historyService.createHistoryRecord(
				{ id },
				"InterviewStageEntity",
				"DELETE",
				manager
			);
			return true;
		});
	}
}
