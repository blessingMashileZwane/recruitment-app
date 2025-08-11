import { registerEnumType } from "type-graphql";

export enum CandidateSortField {
	NAME = "name",
	POSITION = "position",
	EXPERIENCE = "experience",
	ADDED_DATE = "addedDate",
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
