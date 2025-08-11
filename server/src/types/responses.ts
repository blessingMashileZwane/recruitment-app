import { ObjectType, Field } from "type-graphql";
import { CandidateEntity } from "../entities";

@ObjectType()
export class CandidateListResponse {
	@Field(() => [CandidateEntity])
	items: CandidateEntity[];

	@Field()
	total: number;

	@Field()
	totalPages: number;
}
