import { HistoryService } from "./../utils/history.service";
import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { CandidateEntity, JobApplicationEntity } from "../entities";
import { DataSource } from "typeorm";
import { AppliedJob, AppliedJobStatus } from "../types";
import { JobApplicationOutput } from "../types/outputs";
import { runTransaction } from "../utils";

@Resolver(() => JobApplicationEntity)
export class JobApplicationResolver {
	private historyService: HistoryService;
	constructor(private dataSource: DataSource) {
		this.historyService = new HistoryService(this.dataSource);
	}

	@Query(() => [JobApplicationOutput])
	async jobApplications(): Promise<JobApplicationOutput[]> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		return repository.find({
			relations: ["candidate", "interviewStages", "history"],
		});
	}

	@Query(() => JobApplicationOutput, { nullable: true })
	async jobApplication(
		@Arg("id", () => ID) id: string
	): Promise<JobApplicationOutput | null> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		return repository.findOne({
			where: { id },
			relations: ["candidate", "interviewStages", "history"],
		});
	}

	@Query(() => [JobApplicationOutput])
	async jobApplicationsByCandidateId(
		@Arg("candidateId", () => ID) candidateId: string
	): Promise<JobApplicationOutput[]> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		return repository.find({
			where: { candidate: { id: candidateId } },
			relations: ["candidate"],
		});
	}

	@Mutation(() => JobApplicationOutput)
	async createJobApplication(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("appliedJob", () => AppliedJob) appliedJob: AppliedJob,
		@Arg("applicationStatus", () => AppliedJobStatus, { nullable: true })
		applicationStatus: AppliedJobStatus = AppliedJobStatus.ACTIVE,
		@Arg("appliedJobOther", { nullable: true }) appliedJobOther?: string,
		@Arg("isActive", { nullable: true }) isActive: boolean = true
	): Promise<JobApplicationOutput> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		const candidateRepo = this.dataSource.getRepository(CandidateEntity);
		const candidate = await candidateRepo.findOneOrFail({
			where: { id: candidateId },
		});

		const application = repository.create({
			candidate,
			appliedJob,
			applicationStatus,
			appliedJobOther,
			isActive,
		});

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(application);
			await this.historyService.createHistoryRecord(
				application,
				"JobApplicationEntity",
				"CREATE",
				manager
			);
			return response;
		});
	}

	@Mutation(() => JobApplicationOutput)
	async updateJobApplication(
		@Arg("id", () => ID) id: string,
		@Arg("appliedJob", () => AppliedJob, { nullable: true })
		appliedJob?: AppliedJob,
		@Arg("applicationStatus", () => AppliedJobStatus, { nullable: true })
		applicationStatus?: AppliedJobStatus,
		@Arg("appliedJobOther", { nullable: true }) appliedJobOther?: string,
		@Arg("isActive", { nullable: true }) isActive?: boolean
	): Promise<JobApplicationOutput> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		const application = await repository.findOneOrFail({
			where: { id },
			relations: ["candidate"],
		});

		if (appliedJob !== undefined) application.appliedJob = appliedJob;
		if (applicationStatus !== undefined)
			application.applicationStatus = applicationStatus;
		if (appliedJobOther !== undefined)
			application.appliedJobOther = appliedJobOther;
		if (isActive !== undefined) application.isActive = isActive;

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(application);
			await this.historyService.createHistoryRecord(
				application,
				"JobApplicationEntity",
				"CREATE",
				manager
			);
			return response;
		});
	}

	@Mutation(() => JobApplicationOutput)
	async updateJobApplicationByCandidateId(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("appliedJob", () => AppliedJob, { nullable: true })
		appliedJob?: AppliedJob,
		@Arg("applicationStatus", () => AppliedJobStatus, { nullable: true })
		applicationStatus?: AppliedJobStatus,
		@Arg("appliedJobOther", { nullable: true }) appliedJobOther?: string,
		@Arg("isActive", { nullable: true }) isActive?: boolean
	): Promise<JobApplicationOutput> {
		const repository = this.dataSource.getRepository(JobApplicationEntity);
		const application = await repository.findOneOrFail({
			where: { candidate: { id: candidateId } },
			relations: ["candidate"],
		});

		if (appliedJob !== undefined) application.appliedJob = appliedJob;
		if (applicationStatus !== undefined)
			application.applicationStatus = applicationStatus;
		if (appliedJobOther !== undefined)
			application.appliedJobOther = appliedJobOther;
		if (isActive !== undefined) application.isActive = isActive;

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(application);
			await this.historyService.createHistoryRecord(
				application,
				"JobApplicationEntity",
				"UPDATE",
				manager
			);
			return response;
		});
	}

	@Mutation(() => Boolean)
	async deleteJobApplication(
		@Arg("id", () => ID) id: string
	): Promise<boolean> {
		return runTransaction(this.dataSource, async (manager) => {
			await manager.delete(JobApplicationEntity, id);
			await this.historyService.createHistoryRecord(
				{ id },
				"JobApplicationEntity",
				"DELETE",
				manager
			);
			return true;
		});
	}
}
