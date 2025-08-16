import type { BulkCreateCandidatesOutput } from "../types";
import type { CreateCandidateInput } from "../types/inputs";
import { graphqlService } from "./graphql.service";

export type CsvRow = {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	status?: string;
	resumeUrl?: string;
	currentLocation?: string;
	citizenship?: string;
	university?: string;
	qualification?: string;
	proficiencyLevel?: string;
	jobTitle?: string;
	department?: string;
	appliedJob?: string;
	appliedStatus?: string;
	title?: string;
	requirements?: string;
	isActive?: string | boolean;
};

interface ProgressCallback {
	processed: number;
	total: number;
	successCount: number;
	failureCount: number;
}

export const candidateService = {
	async createFullCandidate(candidateData: CreateCandidateInput) {
		try {
			await graphqlService.createFullCandidate(candidateData);
			return { success: true };
		} catch (error) {
			console.error("Failed to add candidate:", error);
			throw new Error("Failed to add candidate");
		}
	},

	async processBulkUpload(
		file: File,
		onProgress?: (progress: ProgressCallback) => void
	): Promise<BulkCreateCandidatesOutput> {
		try {
			const fileContent = await file.text();
			const candidates = this.parseCSVToCandidates(fileContent);

			onProgress?.({
				processed: 0,
				total: candidates.length,
				successCount: 0,
				failureCount: 0,
			});

			const bulkResult = await graphqlService.addCandidatesBulk(candidates);

			if (!bulkResult) {
				throw new Error("No response from server");
			}

			// Final progress update
			onProgress?.({
				processed: bulkResult.totalProcessed,
				total: bulkResult.totalProcessed,
				successCount: bulkResult.successCount,
				failureCount: bulkResult.failureCount,
			});

			// Transform the server response to match our expected type
			return {
				success: bulkResult.success,
				failed: bulkResult.failed,
				totalProcessed: bulkResult.totalProcessed,
				successCount: bulkResult.successCount,
				failureCount: bulkResult.failureCount,
				processingTimeMs: bulkResult.processingTimeMs,
			};
		} catch (error) {
			console.error("Error in processBulkUpload:", error);
			throw error;
		}
	},

	parseCSVToCandidates(csvContent: string): CreateCandidateInput[] {
		const lines = csvContent.trim().split("\n");
		if (lines.length < 2) {
			throw new Error(
				"CSV file must contain headers and at least one data row"
			);
		}

		const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
		const candidates: CreateCandidateInput[] = [];

		for (let i = 1; i < lines.length; i++) {
			const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));

			if (values.length !== headers.length) {
				console.warn(`Skipping row ${i + 1}: Column count mismatch`);
				continue;
			}

			const row: Record<string, string> = {};
			headers.forEach((header, index) => {
				row[header] = values[index] || "";
			});

			try {
				const candidate = this.rowToCandidateInput(row);
				candidates.push(candidate);
			} catch (error) {
				console.warn(`Skipping row ${i + 1}: ${(error as Error).message}`);
			}
		}

		return candidates;
	},

	rowToCandidateInput(row: Record<string, string>): CreateCandidateInput {
		// Validate required fields
		if (!row.firstName || !row.lastName || !row.email) {
			throw new Error("Missing required fields: firstName, lastName, or email");
		}

		if (!row.university || !row.qualification) {
			throw new Error(
				"Missing required skill fields: university or qualification"
			);
		}

		if (!row.appliedJob) {
			throw new Error("Missing required field: appliedJob");
		}

		return {
			firstName: row.firstName,
			lastName: row.lastName,
			email: row.email,
			phone: row.phone || undefined,
			currentLocation: row.currentLocation || undefined,
			citizenship: row.citizenship || undefined,
			status: (row.status as any) || "OPEN",
			resumeUrl: row.resumeUrl || undefined,
			candidateSkill: {
				university: row.university,
				qualification: row.qualification,
				yearsOfExperience: parseInt(row.yearsOfExperience) || 0,
				proficiencyLevel: parseInt(row.proficiencyLevel) || 1,
				possessedSkills: row.possessedSkills || undefined,
			},
			jobApplications: [
				{
					appliedJob: row.appliedJob as any,
					applicationStatus: (row.applicationStatus as any) || "ACTIVE",
					appliedJobOther: row.appliedJobOther || undefined,
					isActive: row.isActive === "true" || row.isActive === "1",
				},
			],
		};
	},
};
