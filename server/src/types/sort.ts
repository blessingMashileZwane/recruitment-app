import { registerEnumType } from "type-graphql";

export enum CandidateSortField {
	FIRST_NAME = "firstName",
	LAST_NAME = "lastName",
	CANDIDATE_STATUS = "status",
	APPLIED_JOB = "appliedJob",
	CREATED_AT = "createdAt",
	APPLIED_JOB_STATUS = "applicationStatus",
}
export enum SortOrder {
	ASC = "asc",
	DESC = "desc",
}

registerEnumType(CandidateSortField, {
	name: "CandidateSortField",
	description: "The field to sort candidates by",
});

registerEnumType(SortOrder, {
	name: "SortOrder",
	description: "The order to sort results in",
});
