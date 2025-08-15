import { DataSource } from "typeorm";
import {
	CandidateEntity,
	CandidateSkillEntity,
	JobApplicationEntity,
	InterviewStageEntity,
	CandidateHistoryEntity,
	CandidateSkillHistoryEntity,
	JobApplicationHistoryEntity,
	InterviewStageHistoryEntity,
} from "../entities";
import { AuditSubscriber } from "../subscribers";
import { AddAuditFields1692123456789 } from "../migrations/AddAuditFields1692123456789";

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
			CandidateHistoryEntity,
			CandidateSkillEntity,
			CandidateSkillHistoryEntity,
			InterviewStageEntity,
			InterviewStageHistoryEntity,
			JobApplicationEntity,
			JobApplicationHistoryEntity,
		],
		subscribers: [AuditSubscriber],
		migrations: [AddAuditFields1692123456789],
		synchronize: false,
		dropSchema: false,
		logging: true,
	});

	await AppDataSource.initialize();
	return AppDataSource;
}
