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

@Resolver(() => CandidateEntity)
export class FullCandidateResolver {
	private historyService: HistoryService;
	constructor(private dataSource: DataSource) {
		this.historyService = new HistoryService(dataSource);
	}

	@Query(() => CandidateEntity, { nullable: true })
	async fullCandidate(
		@Arg("id", () => ID) id: string
	): Promise<CandidateEntity | null> {
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

	@Mutation(() => CandidateEntity)
	async createFullCandidate(
		@Arg("fullCandidate") input: CreateCandidateInput
	): Promise<CandidateEntity> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		const existingCandidate = await queryRunner.manager.findOne(
			CandidateEntity,
			{
				where: { email: input.email },
			}
		);
		if (existingCandidate) {
			throw new Error("A candidate with this email already exists");
		}

		try {
			// Candidate
			const candidate = new CandidateEntity();
			candidate.firstName = input.firstName;
			candidate.lastName = input.lastName;
			candidate.email = input.email;
			candidate.phone = input.phone;
			candidate.status = CandidateStatus.OPEN;
			candidate.currentLocation = input.currentLocation;
			candidate.citizenship = input.citizenship;
			candidate.resumeUrl = input.resumeUrl;

			await queryRunner.manager.save(candidate); // subscriber will set createdBy

			await this.historyService.createHistoryRecord(
				candidate,
				"CandidateEntity",
				"CREATE",
				queryRunner
			);

			// Candidate Skill
			const skill = new CandidateSkillEntity();
			skill.university = input.candidateSkill.university;
			skill.qualification = input.candidateSkill.qualification;
			skill.proficiencyLevel = input.candidateSkill.proficiencyLevel;
			skill.yearsOfExperience = 0;
			skill.candidateId = candidate.id;

			await queryRunner.manager.save(skill); // subscriber runs

			await this.historyService.createHistoryRecord(
				skill,
				"CandidateSkillEntity",
				"CREATE",
				queryRunner
			);

			// Job Application
			const jobApplication = new JobApplicationEntity();
			jobApplication.title = input.jobApplication.title;
			jobApplication.appliedJob = input.jobApplication.status;
			jobApplication.applicationStatus = AppliedJobStatus.ACTIVE;
			jobApplication.department = input.jobApplication.department;
			jobApplication.requirements = input.jobApplication.requirements;
			jobApplication.isActive = input.jobApplication.isActive;
			jobApplication.candidate = candidate;

			await queryRunner.manager.save(jobApplication);

			await this.historyService.createHistoryRecord(
				jobApplication,
				"JobApplicationEntity",
				"CREATE",
				queryRunner
			);

			// Link skill to candidate
			candidate.candidateSkill = skill;
			await queryRunner.manager.save(candidate); // triggers subscriber for updatedBy

			await queryRunner.commitTransaction();

			const result = await this.fullCandidate(candidate.id);
			if (!result) {
				throw new Error("Failed to load created candidate");
			}
			return result;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}
}
