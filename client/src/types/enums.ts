export const CandidateStatus = {
	OPEN: "open",
	CLOSED: "closed",
} as const;

export const AppliedJobStatus = {
	ACTIVE: "active",
	HIRED: "hired",
	REJECTED: "rejected",
	WITHDRAWN: "withdrawn",
} as const;

export type AppliedJobStatus =
	(typeof AppliedJobStatus)[keyof typeof AppliedJobStatus];

export type CandidateStatus =
	(typeof CandidateStatus)[keyof typeof CandidateStatus];

export const AppliedJob = {
	OPS: "operations",
	FINANCE: "finance",
	ACTUARIAL: "actuarial",
	RECRUITMENT: "recruitment",
	MARKETING: "marketing",
	ASSESSOR: "assessor",
	TECH: "tech",
	OTHER: "other",
} as const;

export const CandidateSortField = {
	FIRST_NAME: "FIRST_NAME",
	LAST_NAME: "LAST_NAME",
	CREATED_AT: "CREATED_AT",
} as const;

export const SortOrder = {
	ASC: "ASC",
	DESC: "DESC",
} as const;

export type CandidateSortField =
	(typeof CandidateSortField)[keyof typeof CandidateSortField];

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export type AppliedJob = (typeof AppliedJob)[keyof typeof AppliedJob];
