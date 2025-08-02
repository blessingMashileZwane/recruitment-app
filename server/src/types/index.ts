import { InputType, Field } from "type-graphql";

export enum CandidateStatus {
	ACTIVE = "active",
	HIRED = "hired",
	REJECTED = "rejected",
	WITHDRAWN = "withdrawn",
}

export enum InterviewStatus {
	SCHEDULED = "scheduled",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
	PENDING = "pending",
}

export enum AppliedJob {
	OPS = "operations",
	FINANCE = "finance",
	ACTUARIAL = "actuarial",
	RECRUITMENT = "recruitment",
	MARKETING = "marketing",
	ASSESSOR = "assessor",
	TECH = "tech",
	OTHER = "other",
}

@InputType()
class JobApplication {
	title: string;
	status: AppliedJob;
	department?: string;
	description?: string;
	requirements?: string;
	isActive: boolean;
}

@InputType()
class InterviewProgress {
	@Field(() => InterviewStatus)
	interviewStatus: InterviewStatus;
}

@InputType()
class CandidateSkill {
	@Field()
	university: string;

	@Field()
	qualification: string;

	@Field()
	proficiencyLevel: number;
}

@InputType()
class InterviewStage {
	@Field()
	name: string;

	@Field({ nullable: true })
	description?: string;

	@Field()
	feedback: string;
}

@InputType()
export class FullCandidate {
	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	email: string;

	@Field({ nullable: true })
	phone?: string;

	@Field({ nullable: true })
	currentLocation?: string;
	@Field({ nullable: true })
	citizenship?: string;
	@Field(() => CandidateStatus)
	status: CandidateStatus;

	@Field({ nullable: true })
	resumeUrl?: string;

	@Field(() => CandidateSkill)
	candidateSkill: CandidateSkill;

	@Field(() => InterviewProgress)
	interviewProgress: InterviewProgress;
	@Field(() => JobApplication)
	jobApplication: JobApplication;
	@Field(() => [InterviewStage])
	interviewStages: InterviewStage[];
}
