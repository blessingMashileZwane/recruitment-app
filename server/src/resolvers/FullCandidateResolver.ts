import { Arg, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import { DataSource, EntityManager, In } from "typeorm";
import {
	CandidateEntity,
	CandidateSkillEntity,
	JobApplicationEntity,
} from "../entities";
import { AppliedJobStatus, CandidateStatus } from "../types";
import { CreateCandidateInput } from "../types/inputs";
import { BulkCreateCandidatesOutput, CandidateOutput } from "../types/outputs";
import { HistoryService } from "../utils/history.service";
import pLimit from "p-limit";

@Resolver(() => CandidateOutput)
export class FullCandidateResolver {
	private historyService: HistoryService;
	constructor(private dataSource: DataSource) {
		this.historyService = new HistoryService(dataSource);
	}

	@Query(() => CandidateOutput, { nullable: true })
	async fullCandidate(
		id: string,
		manager?: EntityManager
	): Promise<CandidateOutput | null> {
		const repository = manager
			? manager.getRepository(CandidateEntity)
			: this.dataSource.getRepository(CandidateEntity);

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
	async addCandidatesBulkOptimized(
		@Arg("input", () => [CreateCandidateInput]) input: CreateCandidateInput[],
		@Arg("batchSize", () => Int, { defaultValue: 10 }) batchSize: number = 10
	): Promise<BulkCreateCandidatesOutput> {
		const startTime = Date.now();
		const success: CandidateOutput[] = [];
		const failed: { email: string; reason: string }[] = [];

		// Pre-check existing emails
		const emails = input.map((c) => c.email);
		const existingCandidates = await this.dataSource
			.getRepository(CandidateEntity)
			.find({ where: { email: In(emails) }, select: ["email"] });
		const existingEmails = new Set(existingCandidates.map((c) => c.email));

		const limit = pLimit(5); // limit concurrency

		for (let i = 0; i < input.length; i += batchSize) {
			const batch = input.slice(i, i + batchSize);

			const promises = batch.map((candidateInput) =>
				limit(async () => {
					if (existingEmails.has(candidateInput.email)) {
						failed.push({
							email: candidateInput.email,
							reason: "Email exists",
						});
						return;
					}

					try {
						const fullCandidate = await this.createFullCandidate(
							candidateInput
						);
						success.push(fullCandidate);
						existingEmails.add(candidateInput.email);
					} catch (err) {
						failed.push({
							email: candidateInput.email,
							reason: (err as Error).message,
						});
					}
				})
			);

			await Promise.all(promises);
		}

		const processingTime = Date.now() - startTime;

		return {
			success,
			failed,
			totalProcessed: input.length,
			successCount: success.length,
			failureCount: failed.length,
			processingTimeMs: processingTime,
		};
	}

	// @Mutation(() => BulkCreateCandidatesOutput)
	// async addCandidatesBulkOptimized(
	// 	@Arg("input", () => [CreateCandidateInput]) input: CreateCandidateInput[],
	// 	@Arg("batchSize", () => Int, { defaultValue: 10 }) batchSize: number = 10
	// ): Promise<BulkCreateCandidatesOutput> {
	// 	const startTime = Date.now();
	// 	const success: CandidateOutput[] = [];
	// 	const failed: { email: string; reason: string }[] = [];

	// 	// Pre-check for existing emails to avoid unnecessary processing
	// 	const emails = input.map((candidate) => candidate.email);
	// 	const existingCandidates = await this.dataSource
	// 		.getRepository(CandidateEntity)
	// 		.find({
	// 			where: { email: In(emails) },
	// 			select: ["email"],
	// 		});

	// 	const existingEmails = new Set(existingCandidates.map((c) => c.email));

	// 	// Process in batches
	// 	for (let i = 0; i < input.length; i += batchSize) {
	// 		const batch = input.slice(i, i + batchSize);
	// 		await this.processCandidateBatch(batch, existingEmails, success, failed);
	// 	}

	// 	const processingTime = Date.now() - startTime;

	// 	return {
	// 		success,
	// 		failed,
	// 		totalProcessed: input.length,
	// 		successCount: success.length,
	// 		failureCount: failed.length,
	// 		processingTimeMs: processingTime,
	// 	};
	// }

	// private async processCandidateBatch(
	// 	batch: CreateCandidateInput[],
	// 	existingEmails: Set<string>,
	// 	success: CandidateOutput[],
	// 	failed: { email: string; reason: string }[]
	// ): Promise<void> {
	// 	const queryRunner = this.dataSource.createQueryRunner();
	// 	await queryRunner.connect();
	// 	await queryRunner.startTransaction();

	// 	try {
	// 		for (const candidateInput of batch) {
	// 			try {
	// 				if (existingEmails.has(candidateInput.email)) {
	// 					failed.push({
	// 						email: candidateInput.email,
	// 						reason: "Email already exists",
	// 					});
	// 					continue;
	// 				}

	// 				// Create candidate
	// 				const candidate = queryRunner.manager.create(CandidateEntity, {
	// 					firstName: candidateInput.firstName,
	// 					lastName: candidateInput.lastName,
	// 					email: candidateInput.email,
	// 					phone: candidateInput.phone,
	// 					status: candidateInput.status ?? CandidateStatus.OPEN,
	// 					currentLocation: candidateInput.currentLocation,
	// 					citizenship: candidateInput.citizenship,
	// 					resumeUrl: candidateInput.resumeUrl,
	// 				});
	// 				await queryRunner.manager.save(candidate);
	// 				await this.historyService.createHistoryRecord(
	// 					candidate,
	// 					"CandidateEntity",
	// 					"CREATE",
	// 					queryRunner
	// 				);

	// 				// Create skill
	// 				const skill = queryRunner.manager.create(CandidateSkillEntity, {
	// 					candidateId: candidate.id,
	// 					university: candidateInput.candidateSkill.university,
	// 					qualification: candidateInput.candidateSkill.qualification,
	// 					proficiencyLevel: candidateInput.candidateSkill.proficiencyLevel,
	// 					yearsOfExperience:
	// 						candidateInput.candidateSkill.yearsOfExperience || 0,
	// 					possessedSkills: candidateInput.candidateSkill.possessedSkills,
	// 				});
	// 				await queryRunner.manager.save(skill);
	// 				await this.historyService.createHistoryRecord(
	// 					skill,
	// 					"CandidateSkillEntity",
	// 					"CREATE",
	// 					queryRunner
	// 				);

	// 				// Create job applications
	// 				if (candidateInput.jobApplications?.length) {
	// 					for (const jobInput of candidateInput.jobApplications) {
	// 						const jobApp = queryRunner.manager.create(JobApplicationEntity, {
	// 							candidate,
	// 							appliedJob: jobInput.appliedJob,
	// 							applicationStatus: jobInput.applicationStatus,
	// 							appliedJobOther: jobInput.appliedJobOther,
	// 							isActive: jobInput.isActive,
	// 						});
	// 						await queryRunner.manager.save(jobApp);
	// 						await this.historyService.createHistoryRecord(
	// 							jobApp,
	// 							"JobApplicationEntity",
	// 							"CREATE",
	// 							queryRunner
	// 						);
	// 					}
	// 				}

	// 				// Commit transaction before fetching full candidate
	// 				await queryRunner.commitTransaction();

	// 				// Load full candidate with all relations
	// 				const fullCandidate = await this.fullCandidate(
	// 					candidate.id,
	// 					queryRunner.manager
	// 				);

	// 				console.log("Full candidate loaded:", fullCandidate);
	// 				console.log("Candidate skill:", fullCandidate?.candidateSkill);

	// 				if (fullCandidate && fullCandidate.candidateSkill) {
	// 					success.push(fullCandidate);
	// 					existingEmails.add(candidateInput.email);
	// 				} else {
	// 					failed.push({
	// 						email: candidateInput.email,
	// 						reason: "Failed to load candidate skill after creation",
	// 					});
	// 				}
	// 			} catch (err) {
	// 				failed.push({
	// 					email: candidateInput.email,
	// 					reason: (err as Error).message,
	// 				});
	// 			}
	// 		}
	// 	} catch (err) {
	// 		await queryRunner.rollbackTransaction();
	// 		throw err;
	// 	} finally {
	// 		await queryRunner.release();
	// 	}
	// }
}
