import { HistoryService } from "./../utils/history.service";
import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { InterviewStageEntity, JobApplicationEntity } from "../entities";
import { DataSource } from "typeorm";
import { InterviewStageOutput } from "../types/outputs";
import { runTransaction } from "../utils";

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
			relations: ["jobApplication", "history"],
		});
	}

	@Query(() => [InterviewStageOutput], { nullable: true })
	async interviewStagesByCandidateId(
		@Arg("candidateId", () => ID) candidateId: string
	): Promise<InterviewStageOutput[] | null> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		return repository.find({
			where: { jobApplication: { candidate: { id: candidateId } } },
			relations: ["jobApplication", "history"],
		});
	}

	@Mutation(() => InterviewStageOutput)
	async createInterviewStage(
		@Arg("jobApplicationId", () => ID) jobApplicationId: string,
		@Arg("name") name: string,
		@Arg("feedback") feedback: string,
		@Arg("rating") rating: number,
		@Arg("nextStepNotes") nextStepNotes: string
	): Promise<InterviewStageOutput> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const jobApplicationRepo =
			this.dataSource.getRepository(JobApplicationEntity);
		const jobApplication = await jobApplicationRepo.findOneOrFail({
			where: { id: jobApplicationId },
		});

		const stage = repository.create({
			name,
			feedback,
			rating,
			nextStepNotes,
			jobApplication,
		});

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(stage);
			await this.historyService.createHistoryRecord(
				stage,
				"InterviewStageEntity",
				"CREATE",
				manager
			);
			return response;
		});
	}

	@Mutation(() => InterviewStageOutput)
	async updateInterviewStage(
		@Arg("id", () => ID) id: string,
		@Arg("name", { nullable: true }) name?: string,
		@Arg("feedback", { nullable: true }) feedback?: string,
		@Arg("rating", { nullable: true }) rating?: number,
		@Arg("nextStepNotes", { nullable: true }) nextStepNotes?: string
	): Promise<InterviewStageOutput> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const stage = await repository.findOneOrFail({
			where: { id },
			relations: ["jobApplication"],
		});

		if (name !== undefined) stage.name = name;
		if (feedback !== undefined) stage.feedback = feedback;
		if (rating !== undefined) stage.rating = rating;
		if (nextStepNotes !== undefined) stage.nextStepNotes = nextStepNotes;

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
