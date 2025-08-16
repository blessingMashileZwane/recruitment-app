import { DataSource, EntityManager, QueryRunner } from "typeorm";
import {
	CandidateHistoryEntity,
	CandidateSkillHistoryEntity,
	InterviewStageHistoryEntity,
	JobApplicationHistoryEntity,
} from "../entities";
import { userContext } from "../middleware";
import { AppliedJob, AppliedJobStatus, CandidateStatus } from "../types";

export class HistoryService {
	constructor(private dataSource: DataSource) {}

	async createHistoryRecord(
		entity: any,
		entityName: string,
		action: "CREATE" | "UPDATE" | "DELETE",
		managerOrRunner?: QueryRunner | EntityManager
	): Promise<void> {
		const manager: EntityManager =
			managerOrRunner && "manager" in managerOrRunner
				? managerOrRunner.manager
				: (managerOrRunner as EntityManager) || this.dataSource.manager;

		const ctx = userContext.getStore();
		const userId = ctx?.userId ?? "system";

		switch (entityName) {
			case "CandidateEntity":
				const candidateHistory = new CandidateHistoryEntity();
				candidateHistory.candidateId = entity.id;
				candidateHistory.action = action;
				candidateHistory.firstName = entity.firstName ?? "";
				candidateHistory.lastName = entity.lastName ?? "";
				candidateHistory.email = entity.email ?? "";
				candidateHistory.phone = entity.phone ?? "";
				candidateHistory.currentLocation = entity.currentLocation ?? "";
				candidateHistory.citizenship = entity.citizenship ?? "";
				candidateHistory.status = entity.status ?? CandidateStatus.OPEN;
				candidateHistory.resumeUrl = entity.resumeUrl ?? "";
				candidateHistory.createdBy = userId;
				await manager.save(candidateHistory);
				break;

			case "CandidateSkillEntity":
				const skillHistory = new CandidateSkillHistoryEntity();
				skillHistory.candidateSkillId = entity.id;
				skillHistory.action = action;
				skillHistory.university = entity.university ?? "";
				skillHistory.qualification = entity.qualification ?? "";
				skillHistory.yearsOfExperience = entity.yearsOfExperience ?? 0;
				skillHistory.proficiencyLevel = entity.proficiencyLevel ?? 0;
				skillHistory.possessedSkills = entity.possessedSkills ?? "";
				skillHistory.createdBy = userId;
				await manager.save(skillHistory);
				break;

			case "JobApplicationEntity":
				const jobHistory = new JobApplicationHistoryEntity();
				jobHistory.jobApplicationId = entity.id;
				jobHistory.action = action;
				jobHistory.appliedJob = entity.appliedJob ?? AppliedJob.OTHER;
				jobHistory.applicationStatus =
					entity.applicationStatus ?? AppliedJobStatus.ACTIVE;
				jobHistory.appliedJobOther = entity.appliedJobOther ?? "";
				jobHistory.isActive = entity.isActive ?? true;
				jobHistory.createdBy = userId;
				await manager.save(jobHistory);
				break;

			case "InterviewStageEntity":
				const stageHistory = new InterviewStageHistoryEntity();
				stageHistory.stageId = entity.id;
				stageHistory.action = action;
				stageHistory.name = entity.name ?? "";
				stageHistory.feedback = entity.feedback ?? "";
				stageHistory.rating = entity.rating ?? 0;
				stageHistory.nextStepNotes = entity.nextStepNotes ?? "";
				stageHistory.createdBy = userId;
				stageHistory.progressToNextStage = entity.progressToNextStage ?? false;
				await manager.save(stageHistory);
				break;

			default:
				console.warn(
					`History creation not implemented for entity: ${entityName}`
				);
		}
	}
}
