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
