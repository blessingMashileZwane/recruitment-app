import { Field, ID, InputType } from "type-graphql";
import { CandidateStatus, AppliedJob, AppliedJobStatus } from "./index";

@InputType()
export class CreateCandidateSkillInput {
	@Field()
	university: string;

	@Field()
	qualification: string;

	@Field()
	proficiencyLevel: number;
}

@InputType()
export class CreateInterviewStageInput {
	@Field()
	name: string;

	@Field()
	feedback: string;

	@Field()
	interviewerName: string;

	@Field()
	rating: number;

	@Field()
	nextStepNotes: string;

	@Field()
	jobApplicationId: string;
}

@InputType()
export class CreateJobApplicationInput {
	@Field()
	title: string;

	@Field(() => AppliedJob)
	status: AppliedJob;

	@Field({ nullable: true })
	department?: string;

	@Field({ nullable: true })
	requirements?: string;

	@Field()
	isActive: boolean;
}

@InputType()
export class CreateCandidateInput {
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

	@Field(() => CandidateStatus, { defaultValue: CandidateStatus.OPEN })
	status: CandidateStatus;

	@Field({ nullable: true })
	resumeUrl?: string;

	@Field(() => CreateCandidateSkillInput)
	candidateSkill: CreateCandidateSkillInput;

	@Field(() => CreateJobApplicationInput)
	jobApplication: CreateJobApplicationInput;
}

@InputType()
export class UpdateCandidateSkillInput {
	@Field(() => ID)
	id: string;

	@Field({ nullable: true })
	university?: string;

	@Field({ nullable: true })
	qualification?: string;

	@Field({ nullable: true })
	proficiencyLevel?: number;
}

@InputType()
export class UpdateInterviewStageInput {
	@Field(() => ID)
	id: string;

	@Field({ nullable: true })
	name?: string;

	@Field({ nullable: true })
	feedback?: string;

	@Field({ nullable: true })
	interviewerName?: string;

	@Field({ nullable: true })
	rating?: number;

	@Field({ nullable: true })
	nextStepNotes?: string;
}

@InputType()
export class UpdateJobApplicationInput {
	@Field(() => ID)
	id: string;

	@Field({ nullable: true })
	title?: string;

	@Field(() => AppliedJob, { nullable: true })
	appliedJob?: AppliedJob;

	@Field(() => AppliedJobStatus, { nullable: true })
	applicationStatus?: AppliedJobStatus;

	@Field({ nullable: true })
	department?: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	requirements?: string;

	@Field({ nullable: true })
	isActive?: boolean;
}

@InputType()
export class UpdateCandidateInput {
	@Field(() => ID)
	id: string;

	@Field({ nullable: true })
	firstName?: string;

	@Field({ nullable: true })
	lastName?: string;

	@Field({ nullable: true })
	email?: string;

	@Field({ nullable: true })
	phone?: string;

	@Field({ nullable: true })
	currentLocation?: string;

	@Field({ nullable: true })
	citizenship?: string;

	@Field(() => CandidateStatus, { nullable: true })
	status?: CandidateStatus;

	@Field({ nullable: true })
	resumeUrl?: string;
}

@InputType()
export class CandidateFilterInput {
	@Field({ nullable: true })
	search?: string;

	@Field(() => CandidateStatus, { nullable: true })
	status?: CandidateStatus;

	@Field(() => AppliedJob, { nullable: true })
	jobType?: AppliedJob;
}

@InputType()
export class SortInput {
	@Field()
	field: string;

	@Field()
	direction: "ASC" | "DESC";
}

@InputType()
export class PaginationInput {
	@Field({ defaultValue: 1 })
	page: number;

	@Field({ defaultValue: 10 })
	pageSize: number;
}
