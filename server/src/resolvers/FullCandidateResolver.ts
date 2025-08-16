import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { DataSource } from "typeorm";
import {
	CandidateEntity,
	CandidateSkillEntity,
	JobApplicationEntity,
} from "../entities";
import { AppliedJobStatus, CandidateStatus } from "../types";
import { CreateCandidateInput } from "../types/inputs";
import { BulkCreateCandidatesOutput, CandidateOutput } from "../types/outputs";
import { HistoryService } from "../utils/history.service";

@Resolver(() => CandidateOutput)
export class FullCandidateResolver {
	private historyService: HistoryService;
	constructor(private dataSource: DataSource) {
		this.historyService = new HistoryService(dataSource);
	}

	@Query(() => CandidateOutput, { nullable: true })
	async fullCandidate(
		@Arg("id", () => ID) id: string
	): Promise<CandidateOutput | null> {
		const repository = this.dataSource.getRepository(CandidateEntity);
		return repository.findOne({
			where: { id },
			relations: [
				"candidateSkill",
				"candidateSkill.history",
				"jobApplications",
				"jobApplications.history",
				"jobApplications.interviewStages",
				"jobApplications.interviewStages.history",
				"history",
			],
		});
	}

	@Mutation(() => CandidateOutput)
	async createFullCandidate(
		@Arg("fullCandidate") input: CreateCandidateInput
	): Promise<CandidateOutput> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		const existingCandidate = await queryRunner.manager.findOne(
			CandidateEntity,
			{ where: { email: input.email } }
		);
		if (existingCandidate) {
			throw new Error("A candidate with this email already exists");
		}

		try {
			const candidate = new CandidateEntity();
			candidate.firstName = input.firstName;
			candidate.lastName = input.lastName;
			candidate.email = input.email;
			candidate.phone = input.phone;
			candidate.status = input.status ?? CandidateStatus.OPEN;
			candidate.currentLocation = input.currentLocation;
			candidate.citizenship = input.citizenship;
			candidate.resumeUrl = input.resumeUrl;

			await queryRunner.manager.save(candidate);

			await this.historyService.createHistoryRecord(
				candidate,
				"CandidateEntity",
				"CREATE",
				queryRunner
			);

			const skill = new CandidateSkillEntity();
			skill.university = input.candidateSkill.university;
			skill.qualification = input.candidateSkill.qualification;
			skill.proficiencyLevel = input.candidateSkill.proficiencyLevel;
			skill.yearsOfExperience = 0;
			skill.candidate = candidate;

			await queryRunner.manager.save(skill);

			await this.historyService.createHistoryRecord(
				skill,
				"CandidateSkillEntity",
				"CREATE",
				queryRunner
			);

			for (const jobInput of input.jobApplications) {
				const jobApplication = new JobApplicationEntity();
				jobApplication.appliedJob = jobInput.appliedJob;
				jobApplication.applicationStatus = AppliedJobStatus.ACTIVE;
				jobApplication.appliedJobOther = jobInput.appliedJobOther;
				jobApplication.isActive = jobInput.isActive;
				jobApplication.candidate = candidate;

				await queryRunner.manager.save(jobApplication);

				await this.historyService.createHistoryRecord(
					jobApplication,
					"JobApplicationEntity",
					"CREATE",
					queryRunner
				);
			}

			candidate.candidateSkill = skill;
			await queryRunner.manager.save(candidate);

			await queryRunner.commitTransaction();

			const result = await this.fullCandidate(candidate.id);
			if (!result) throw new Error("Failed to load created candidate");
			return result;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	@Mutation(() => BulkCreateCandidatesOutput)
	async addCandidatesBulk(
		@Arg("input", () => [CreateCandidateInput]) input: CreateCandidateInput[]
	): Promise<BulkCreateCandidatesOutput> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		const success: CandidateOutput[] = [];
		const failed: { email: string; reason: string }[] = [];

		try {
			for (const candidateInput of input) {
				try {
					const existingCandidate = await queryRunner.manager.findOne(
						CandidateEntity,
						{
							where: { email: candidateInput.email },
						}
					);
					if (existingCandidate) {
						failed.push({
							email: candidateInput.email,
							reason: "Email already exists",
						});
						continue;
					}

					const candidate = queryRunner.manager.create(CandidateEntity, {
						firstName: candidateInput.firstName,
						lastName: candidateInput.lastName,
						email: candidateInput.email,
						phone: candidateInput.phone,
						status: candidateInput.status ?? CandidateStatus.OPEN,
						currentLocation: candidateInput.currentLocation,
						citizenship: candidateInput.citizenship,
						resumeUrl: candidateInput.resumeUrl,
					});
					await queryRunner.manager.save(candidate);
					await this.historyService.createHistoryRecord(
						candidate,
						"CandidateEntity",
						"CREATE",
						queryRunner
					);

					const skill = queryRunner.manager.create(CandidateSkillEntity, {
						candidateId: candidate.id,
						university: candidateInput.candidateSkill.university,
						qualification: candidateInput.candidateSkill.qualification,
						proficiencyLevel: candidateInput.candidateSkill.proficiencyLevel,
						yearsOfExperience: 0,
					});
					await queryRunner.manager.save(skill);
					await this.historyService.createHistoryRecord(
						skill,
						"CandidateSkillEntity",
						"CREATE",
						queryRunner
					);

					if (candidateInput.jobApplications?.length) {
						for (const jobInput of candidateInput.jobApplications) {
							const jobApp = queryRunner.manager.create(JobApplicationEntity, {
								candidate,
								appliedJob: jobInput.appliedJob,
								applicationStatus: jobInput.applicationStatus,
								appliedJobOther: jobInput.appliedJobOther,
								isActive: jobInput.isActive,
							});
							await queryRunner.manager.save(jobApp);
							await this.historyService.createHistoryRecord(
								jobApp,
								"JobApplicationEntity",
								"CREATE",
								queryRunner
							);
						}
					}

					const fullCandidate = await this.fullCandidate(candidate.id);
					if (fullCandidate) {
						success.push(fullCandidate);
					} else {
						failed.push({
							email: candidateInput.email,
							reason: "Failed to load candidate after creation",
						});
					}
				} catch (err) {
					failed.push({
						email: candidateInput.email,
						reason: (err as Error).message,
					});
				}
			}

			await queryRunner.commitTransaction();
			return { success, failed };
		} catch (err) {
			await queryRunner.rollbackTransaction();
			throw err;
		} finally {
			await queryRunner.release();
		}
	}
}
