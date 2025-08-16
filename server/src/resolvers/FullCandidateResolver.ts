import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { DataSource } from "typeorm";
import {
	CandidateEntity,
	CandidateSkillEntity,
	JobApplicationEntity,
} from "../entities";
import { CandidateStatus, AppliedJob, AppliedJobStatus } from "../types";
import { CreateCandidateInput } from "../types/inputs";
import { HistoryService } from "../utils/history.service";
import { CandidateOutput } from "../types/outputs";

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
			skill.candidateId = candidate.id;

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
}
