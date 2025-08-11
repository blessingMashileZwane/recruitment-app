import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { DataSource } from "typeorm";
import { FeedbackEntity } from "../entities";

@Resolver(() => FeedbackEntity)
export class FeedbackResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => [FeedbackEntity])
	async feedback(
		@Arg("candidateId", () => ID) candidateId: string
	): Promise<FeedbackEntity[]> {
		const repository = this.dataSource.getRepository(FeedbackEntity);
		return repository.find({ where: { candidateId } });
	}

	@Query(() => FeedbackEntity, { nullable: true })
	async feedbackById(
		@Arg("id", () => ID) id: string
	): Promise<FeedbackEntity | null> {
		const repository = this.dataSource.getRepository(FeedbackEntity);
		return repository.findOne({ where: { id } });
	}

	@Mutation(() => FeedbackEntity)
	async createFeedback(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("interviewerName") interviewerName: string,
		@Arg("interviewStep") interviewStep: string,
		@Arg("rating") rating: number,
		@Arg("comments") comments: string,
		@Arg("nextStepNotes") nextStepNotes: string
	): Promise<FeedbackEntity> {
		const repository = this.dataSource.getRepository(FeedbackEntity);
		const feedback = repository.create({
			candidateId,
			interviewerName,
			interviewStep,
			rating,
			comments,
			nextStepNotes,
			date: new Date().toISOString().split("T")[0],
		});
		return repository.save(feedback);
	}

	@Mutation(() => FeedbackEntity)
	async updateFeedback(
		@Arg("id", () => ID) id: string,
		@Arg("interviewerName", { nullable: true }) interviewerName?: string,
		@Arg("interviewStep", { nullable: true }) interviewStep?: string,
		@Arg("rating", { nullable: true }) rating?: number,
		@Arg("comments", { nullable: true }) comments?: string,
		@Arg("nextStepNotes", { nullable: true }) nextStepNotes?: string
	): Promise<FeedbackEntity> {
		const repository = this.dataSource.getRepository(FeedbackEntity);
		const feedback = await repository.findOneOrFail({ where: { id } });

		if (interviewerName) feedback.interviewerName = interviewerName;
		if (interviewStep) feedback.interviewStep = interviewStep;
		if (rating !== undefined) feedback.rating = rating;
		if (comments) feedback.comments = comments;
		if (nextStepNotes) feedback.nextStepNotes = nextStepNotes;

		return repository.save(feedback);
	}

	@Mutation(() => Boolean)
	async deleteFeedback(@Arg("id", () => ID) id: string): Promise<boolean> {
		const repository = this.dataSource.getRepository(FeedbackEntity);
		await repository.delete(id);
		return true;
	}
}
