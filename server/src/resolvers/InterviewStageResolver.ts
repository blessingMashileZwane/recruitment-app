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

	@Query(() => [InterviewStageEntity], { nullable: true })
	async interviewStagesByCandidateId(
		@Arg("candidateId", () => ID) candidateId: string
	): Promise<InterviewStageEntity[] | null> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		return repository.find({
			where: { jobApplication: { candidate: { id: candidateId } } },
			relations: ["jobApplication"],
		});
	}

	@Mutation(() => InterviewStageEntity)
	async createInterviewStage(
		@Arg("name") name: string,
		@Arg("feedback") feedback: string,
		@Arg("interviewerName") interviewerName: string,
		@Arg("rating") rating: number,
		@Arg("nextStepNotes") nextStepNotes: string
	): Promise<InterviewStageEntity> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const stage = repository.create({
			name,
			feedback,
			interviewerName,
			rating,
			nextStepNotes,
		});
		return repository.save(stage);
	}

	@Mutation(() => InterviewStageEntity)
	async updateInterviewStage(
		@Arg("id", () => ID) id: string,
		@Arg("name", { nullable: true }) name?: string,
		@Arg("feedback", { nullable: true }) feedback?: string,
		@Arg("interviewerName", { nullable: true }) interviewerName?: string,
		@Arg("rating", { nullable: true }) rating?: number,
		@Arg("nextStepNotes", { nullable: true }) nextStepNotes?: string
	): Promise<InterviewStageEntity> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const stage = await repository.findOneOrFail({ where: { id } });

		if (name) stage.name = name;
		if (feedback !== undefined) stage.feedback = feedback;
		if (interviewerName !== undefined) stage.interviewerName = interviewerName;
		if (rating !== undefined) stage.rating = rating;
		if (nextStepNotes !== undefined) stage.nextStepNotes = nextStepNotes;

		return repository.save(stage);
	}

	@Mutation(() => InterviewStageEntity)
	async updateInterviewStageByCandidateId(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("name", { nullable: true }) name?: string,
		@Arg("feedback", { nullable: true }) feedback?: string,
		@Arg("interviewerName", { nullable: true }) interviewerName?: string,
		@Arg("rating", { nullable: true }) rating?: number,
		@Arg("nextStepNotes", { nullable: true }) nextStepNotes?: string
	): Promise<InterviewStageEntity> {
		const repository = this.dataSource.getRepository(InterviewStageEntity);
		const stage = await repository.findOneOrFail({
			where: { jobApplication: { candidate: { id: candidateId } } },
			relations: ["jobApplication"],
		});

		if (name) stage.name = name;
		if (feedback !== undefined) stage.feedback = feedback;
		if (interviewerName !== undefined) stage.interviewerName = interviewerName;
		if (rating !== undefined) stage.rating = rating;
		if (nextStepNotes !== undefined) stage.nextStepNotes = nextStepNotes;

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
