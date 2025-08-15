import { DataSource, QueryRunner } from "typeorm";
import {
	CandidateHistoryEntity,
	CandidateSkillHistoryEntity,
	InterviewStageHistoryEntity,
	JobApplicationHistoryEntity,
} from "../entities";
import { userContext } from "../middleware";

// Updated HistoryService with InterviewStageEntity support
export class HistoryService {
	constructor(private dataSource: DataSource) {}

	async createHistoryRecord(
		entity: any,
		entityName: string,
		action: "CREATE" | "UPDATE" | "DELETE",
		queryRunner?: QueryRunner
	): Promise<void> {
		const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;

		const ctx = userContext.getStore();
		const userId = ctx?.userId ?? "system";

		switch (entityName) {
			case "CandidateEntity":
				const candidateHistory = new CandidateHistoryEntity();
				candidateHistory.candidateId = entity.id;
				candidateHistory.action = action;
				candidateHistory.firstName = entity.firstName;
				candidateHistory.lastName = entity.lastName;
				candidateHistory.email = entity.email;
				candidateHistory.phone = entity.phone;
				candidateHistory.currentLocation = entity.currentLocation;
				candidateHistory.citizenship = entity.citizenship;
				candidateHistory.status = entity.status;
				candidateHistory.resumeUrl = entity.resumeUrl;
				candidateHistory.createdBy = userId;
				await manager.save(candidateHistory);

				console.log(`History record created for CandidateEntity: ${entity.id}`);
				break;

			case "CandidateSkillEntity":
				const skillHistory = new CandidateSkillHistoryEntity();
				skillHistory.candidateSkillId = entity.id;
				skillHistory.action = action;
				skillHistory.university = entity.university;
				skillHistory.qualification = entity.qualification;
				skillHistory.yearsOfExperience = entity.yearsOfExperience;
				skillHistory.proficiencyLevel = entity.proficiencyLevel;
				skillHistory.createdBy = userId;
				await manager.save(skillHistory);
				console.log(
					`History record created for CandidateSkillEntity: ${entity.id}`
				);
				break;

			case "JobApplicationEntity":
				const jobHistory = new JobApplicationHistoryEntity();
				jobHistory.jobApplicationId = entity.id;
				jobHistory.action = action;
				jobHistory.appliedJob = entity.appliedJob;
				jobHistory.applicationStatus = entity.applicationStatus;
				jobHistory.department = entity.department;
				jobHistory.requirements = entity.requirements;
				jobHistory.isActive = entity.isActive;
				jobHistory.createdBy = userId;
				await manager.save(jobHistory);
				console.log(
					`History record created for JobApplicationEntity: ${entity.id}`
				);
				break;

			case "InterviewStageEntity":
				const stageHistory = new InterviewStageHistoryEntity();
				stageHistory.stageId = entity.id;
				stageHistory.action = action;
				stageHistory.name = entity.name;
				stageHistory.feedback = entity.feedback;
				stageHistory.interviewerName = entity.interviewerName;
				stageHistory.rating = entity.rating;
				stageHistory.nextStepNotes = entity.nextStepNotes;
				stageHistory.createdBy = userId;
				await manager.save(stageHistory);
				console.log(
					`History record created for InterviewStageEntity: ${entity.id}`
				);
				break;

			default:
				console.warn(
					`History creation not implemented for entity: ${entityName}`
				);
		}
	}
}
