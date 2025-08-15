import Papa from "papaparse";
import { toast } from "sonner";
import { graphqlService } from "./graphql.service";
import { AppliedJob, CandidateStatus, AppliedJobStatus } from "../types/enums";
import type { CreateCandidateInput } from "../types/inputs";

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

	async processBulkUpload(file: File): Promise<void> {
		return new Promise((resolve, reject) => {
			Papa.parse<CsvRow>(file, {
				header: true,
				skipEmptyLines: true,
				complete: async (results) => {
					if (results.errors.length) {
						toast.error(`CSV parsing error: ${results.errors[0].message}`);
						reject(
							new Error(`CSV parsing error: ${results.errors[0].message}`)
						);
						return;
					}

					const candidates: CreateCandidateInput[] = [];
					const invalidRows: number[] = [];

					for (const [index, row] of results.data.entries()) {
						try {
							const candidate: CreateCandidateInput = {
								firstName: String(row["firstName"] || "").trim(),
								lastName: String(row["lastName"] || "").trim(),
								email: String(row["email"] || "").trim(),
								phone: String(row["phone"] || "").trim(),
								currentLocation: String(row["currentLocation"] || "").trim(),
								citizenship: String(row["citizenship"] || "").trim(),
								status: CandidateStatus.OPEN,
								resumeUrl: String(row["resumeUrl"] || "").trim(),
								candidateSkill: {
									university: String(row["university"] || "").trim(),
									qualification: String(row["qualification"] || "").trim(),
									proficiencyLevel: Number(row["proficiencyLevel"]) || 1,
								},
								jobApplication: {
									title: String(row["title"] || "").trim(),
									appliedJob: String(row["appliedJob"] || "TECH") as AppliedJob,
									appliedStatus: AppliedJobStatus.ACTIVE,
									department: String(row["department"] || "").trim(),
									requirements: String(row["requirements"] || "").trim(),
									isActive: Boolean(row["isActive"]) !== false,
								},
							};

							if (!candidate.firstName || !candidate.email) {
								invalidRows.push(index + 2);
								continue;
							}

							candidates.push(candidate);
						} catch {
							invalidRows.push(index + 2);
						}
					}

					if (invalidRows.length > 0) {
						toast.error(`Invalid rows at: ${invalidRows.join(", ")}`);
						reject(new Error(`Invalid rows at: ${invalidRows.join(", ")}`));
						return;
					}

					try {
						const { success, failed } = await graphqlService.addCandidatesBulk(
							candidates
						);
						toast.success(
							`Upload complete. Saved: ${success.length}. Failed: ${failed.length}` +
								(failed.length > 0
									? `. Failed emails: ${failed.map((f) => f.email).join(", ")}`
									: "")
						);
						resolve();
					} catch (error) {
						toast.error(
							"Failed to save candidates: " + (error as Error).message
						);
						reject(error);
					}
				},
				error: (error) => {
					toast.error("Failed to parse file: " + error.message);
					reject(error);
				},
			});
		});
	},
};
