import { DataSource } from "typeorm";
import {
	CandidateEntity,
	CandidateSkillEntity,
	SkillEntity,
	InterviewProgressEntity,
	JobPositionEntity,
	InterviewStageEntity,
	CandidateHistoryEntity,
	CandidateSkillHistoryEntity,
	SkillHistoryEntity,
	InterviewProgressHistoryEntity,
	JobPositionHistoryEntity,
	InterviewStageHistoryEntity,
} from "../entities";

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
			SkillEntity,
			InterviewProgressEntity,
			InterviewStageEntity,
			JobPositionEntity,
			CandidateHistoryEntity,
			CandidateSkillHistoryEntity,
			SkillHistoryEntity,
			InterviewProgressHistoryEntity,
			JobPositionHistoryEntity,
			InterviewStageHistoryEntity,
		],
		synchronize: false, // Disable auto-sync to prevent schema changes
		logging: ["error", "schema"], // Only log errors and schema changes
	});

	await AppDataSource.initialize();
	return AppDataSource;
}
