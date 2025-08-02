import { DataSource } from "typeorm";
import {
	CandidateEntity,
	CandidateSkillEntity,
	InterviewProgressEntity,
	JobApplicationEntity,
	InterviewStageEntity,
	CandidateHistoryEntity,
	CandidateSkillHistoryEntity,
	InterviewProgressHistoryEntity,
	JobApplicationHistoryEntity,
	InterviewStageHistoryEntity,
} from "../entities";
import { AuditSubscriber } from "../subscribers";

export async function getDataSource() {
	const AppDataSource = new DataSource({
		type: "postgres",
		host: process.env.DB_HOST || "localhost",
		port: parseInt(process.env.DB_PORT || "5432"),
		username: process.env.DB_USER || "user",
		password: process.env.DB_PASSWORD || "password",
		database: process.env.DB_NAME || "recruitment_db",
		entities: [
			CandidateEntity,
			CandidateSkillEntity,
			InterviewProgressEntity,
			InterviewStageEntity,
			JobApplicationEntity,
			CandidateHistoryEntity,
			CandidateSkillHistoryEntity,
			InterviewProgressHistoryEntity,
			JobApplicationHistoryEntity,
			InterviewStageHistoryEntity,
		],
		subscribers: [AuditSubscriber],
		synchronize: true,
		dropSchema: true, // This will drop the schema each time to ensure clean sync
		logging: true, // This will show us what SQL is being executed
	});

	await AppDataSource.initialize();
	return AppDataSource;
}
