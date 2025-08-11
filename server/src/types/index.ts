import { InputType, Field } from "type-graphql";

export enum CandidateStatus {
	ACTIVE = "active",
	HIRED = "hired",
	REJECTED = "rejected",
	WITHDRAWN = "withdrawn",
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
	@Field()
	title: string;

	@Field(() => AppliedJob)
	status: AppliedJob;

	@Field({ nullable: true })
	department?: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	requirements?: string;

	@Field()
	isActive: boolean;
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

	@Field()
	interviewerName: string;

	@Field()
	rating: number;

	@Field()
	comments: string;

	@Field()
	nextStepNotes: string;
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

	@Field(() => JobApplication)
	jobApplication: JobApplication;
	@Field(() => [InterviewStage])
	interviewStages: InterviewStage[];
}
