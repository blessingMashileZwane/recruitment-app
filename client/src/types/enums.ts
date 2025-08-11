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

export type AppliedJob = (typeof AppliedJob)[keyof typeof AppliedJob];
