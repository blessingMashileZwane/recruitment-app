import { Field, ID, ObjectType } from "type-graphql";
import { CandidateStatus, AppliedJob } from "./index";

@ObjectType()
export class CandidateSkillOutput {
	@Field(() => ID)
	id: string;

	@Field()
	university: string;

	@Field()
	qualification: string;

	@Field()
	proficiencyLevel: number;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class InterviewStageOutput {
	@Field(() => ID)
	id: string;

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

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class JobApplicationOutput {
	@Field(() => ID)
	id: string;

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

	@Field(() => [InterviewStageOutput])
	interviewStages: InterviewStageOutput[];

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class CandidateOutput {
	@Field(() => ID)
	id: string;

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

	@Field(() => CandidateSkillOutput)
	candidateSkill: CandidateSkillOutput;

	@Field(() => JobApplicationOutput)
	jobApplication: JobApplicationOutput;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class CandidateBasicOutput {
	@Field(() => ID)
	id: string;

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

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field()
	createdBy: string;

	@Field()
	updatedBy: string;
}

@ObjectType()
export class CandidateListResponse {
	@Field(() => [CandidateBasicOutput])
	items: CandidateBasicOutput[];

	@Field()
	total: number;

	@Field()
	page: number;

	@Field()
	pageSize: number;

	@Field()
	totalPages: number;
}
