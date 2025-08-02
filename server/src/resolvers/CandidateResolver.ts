import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { CandidateEntity } from "../entities";
import { DataSource } from "typeorm";
import { CandidateStatus } from "../types";

@Resolver(() => CandidateEntity)
export class CandidateResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => [CandidateEntity])
	async candidates(): Promise<CandidateEntity[]> {
		const repository = this.dataSource.getRepository(CandidateEntity);
		return repository.find();
	}

	@Query(() => CandidateEntity, { nullable: true })
	async candidate(
		@Arg("id", () => ID) id: string
	): Promise<CandidateEntity | null> {
		const repository = this.dataSource.getRepository(CandidateEntity);
		return repository.findOne({ where: { id } });
	}

	@Mutation(() => CandidateEntity)
	async createCandidate(
		@Arg("firstName") firstName: string,
		@Arg("lastName") lastName: string,
		@Arg("email") email: string,
		@Arg("phone", { nullable: true }) phone?: string
	): Promise<CandidateEntity> {
		const repository = this.dataSource.getRepository(CandidateEntity);
		const candidate = repository.create({
			firstName,
			lastName,
			email,
			phone,
			status: CandidateStatus.ACTIVE,
		});
		return repository.save(candidate);
	}

	@Mutation(() => CandidateEntity)
	async updateCandidate(
		@Arg("id", () => ID) id: string,
		@Arg("firstName", { nullable: true }) firstName?: string,
		@Arg("lastName", { nullable: true }) lastName?: string,
		@Arg("email", { nullable: true }) email?: string,
		@Arg("phone", { nullable: true }) phone?: string,
		@Arg("status", () => CandidateStatus, { nullable: true })
		status?: CandidateStatus
	): Promise<CandidateEntity> {
		const repository = this.dataSource.getRepository(CandidateEntity);
		const candidate = await repository.findOneOrFail({ where: { id } });

		if (firstName) candidate.firstName = firstName;
		if (lastName) candidate.lastName = lastName;
		if (email) candidate.email = email;
		if (phone !== undefined) candidate.phone = phone;
		if (status) candidate.status = status;

		return repository.save(candidate);
	}

	@Mutation(() => Boolean)
	async deleteCandidate(@Arg("id", () => ID) id: string): Promise<boolean> {
		const repository = this.dataSource.getRepository(CandidateEntity);
		await repository.delete(id);
		return true;
	}
}
