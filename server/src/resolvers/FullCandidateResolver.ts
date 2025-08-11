import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { DataSource } from "typeorm";
import {
	CandidateEntity,
	CandidateSkillEntity,
	InterviewStageEntity,
	JobApplicationEntity,
} from "../entities";
import { FullCandidate } from "../types";

@Resolver(() => CandidateEntity)
export class FullCandidateResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => CandidateEntity, { nullable: true })
	async fullCandidate(
		@Arg("id", () => ID) id: string
	): Promise<CandidateEntity | null> {
		const repository = this.dataSource.getRepository(CandidateEntity);
		return repository.findOne({
			where: { id },
			relations: ["candidateSkills", "interviewProgress", "history"],
		});
	}

	@Mutation(() => CandidateEntity)
	async createFullCandidate(
		@Arg("fullCandidate") fullCandidate: FullCandidate
	): Promise<CandidateEntity> {
		const candidateRepository = this.dataSource.getRepository(CandidateEntity);
		const candidateSkillRepository =
			this.dataSource.getRepository(CandidateSkillEntity);
		const jobApplicationRepository =
			this.dataSource.getRepository(JobApplicationEntity);
		const interviewStageRepository =
			this.dataSource.getRepository(InterviewStageEntity);

		const candidateSkill = candidateSkillRepository.create({
			university: fullCandidate.candidateSkill.university,
			qualification: fullCandidate.candidateSkill.qualification,
			proficiencyLevel: fullCandidate.candidateSkill.proficiencyLevel,
		});
		const interviewStages = fullCandidate.interviewStages.map((stage) =>
			interviewStageRepository.create({
				name: stage.name,
				description: stage.description,
				feedback: stage.feedback,
			})
		);

		const jobApplication = jobApplicationRepository.create({
			title: fullCandidate.jobApplication.title,
			status: fullCandidate.jobApplication.status,
			department: fullCandidate.jobApplication.department,
			description: fullCandidate.jobApplication.description,
			requirements: fullCandidate.jobApplication.requirements,
			isActive: fullCandidate.jobApplication.isActive,
			interviewStages: interviewStages,
		});

		const candidate = candidateRepository.create({
			firstName: fullCandidate.firstName,
			lastName: fullCandidate.lastName,
			email: fullCandidate.email,
			phone: fullCandidate.phone,
			status: fullCandidate.status,
			currentLocation: fullCandidate.currentLocation,
			citizenship: fullCandidate.citizenship,
			resumeUrl: fullCandidate.resumeUrl,
			candidateSkill: candidateSkill,
			jobApplication: jobApplication,
		});

		await candidateRepository.save(candidate);
		return candidate;
	}
}
