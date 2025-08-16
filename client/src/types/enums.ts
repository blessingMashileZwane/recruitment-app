export const CandidateStatus = {
	OPEN: "OPEN",
	CLOSED: "CLOSED",
} as const;

export const AppliedJobStatus = {
	ACTIVE: "ACTIVE",
	HIRED: "HIRED",
	REJECTED: "REJECTED",
	WITHDRAWN: "WITHDRAWN",
} as const;

export type AppliedJobStatus =
	(typeof AppliedJobStatus)[keyof typeof AppliedJobStatus];

export type CandidateStatus =
	(typeof CandidateStatus)[keyof typeof CandidateStatus];

export const AppliedJob = {
	OPS: "OPERATIONS",
	FINANCE: "FINANCE",
	ACTUARIAL: "ACTUARIAL",
	RECRUITMENT: "RECRUITMENT",
	MARKETING: "MARKETING",
	ASSESSOR: "ASSESSOR",
	TECH: "TECH",
	OTHER: "OTHER",
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
