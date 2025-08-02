import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { CandidateSkillEntity } from "../entities";
import { DataSource } from "typeorm";

@Resolver(() => CandidateSkillEntity)
export class CandidateSkillResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => [CandidateSkillEntity])
	async candidateSkills(): Promise<CandidateSkillEntity[]> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		return repository.find({
			relations: ["candidate", "skill"],
		});
	}

	@Query(() => [CandidateSkillEntity])
	async candidateSkillsByCandidate(
		@Arg("candidateId", () => ID) candidateId: string
	): Promise<CandidateSkillEntity[]> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		return repository.find({
			where: { candidateId },
			relations: ["candidate", "skill"],
		});
	}

	@Mutation(() => CandidateSkillEntity)
	async createCandidateSkill(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("university", () => ID) university: string,
		@Arg("yearsOfExperience") yearsOfExperience: number,
		@Arg("proficiencyLevel") proficiencyLevel: number,
		@Arg("qualification", () => String, { nullable: true })
		qualification?: string
	): Promise<CandidateSkillEntity> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		const candidateSkill = repository.create({
			candidateId,
			university,
			yearsOfExperience,
			proficiencyLevel,
			qualification,
		});
		return repository.save(candidateSkill);
	}

	@Mutation(() => CandidateSkillEntity)
	async updateCandidateSkill(
		@Arg("id", () => ID) id: string,
		@Arg("yearsOfExperience", { nullable: true }) yearsOfExperience?: number,
		@Arg("proficiencyLevel", { nullable: true }) proficiencyLevel?: number
	): Promise<CandidateSkillEntity> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		const candidateSkill = await repository.findOneOrFail({ where: { id } });

		if (yearsOfExperience !== undefined)
			candidateSkill.yearsOfExperience = yearsOfExperience;
		if (proficiencyLevel !== undefined)
			candidateSkill.proficiencyLevel = proficiencyLevel;

		return repository.save(candidateSkill);
	}

	@Mutation(() => CandidateSkillEntity)
	async updateCandidateSkillByCandidateId(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("yearsOfExperience", { nullable: true }) yearsOfExperience?: number,
		@Arg("proficiencyLevel", { nullable: true }) proficiencyLevel?: number
	): Promise<CandidateSkillEntity> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		const candidateSkill = await repository.findOneOrFail({
			where: { candidateId },
			relations: ["candidate", "skill"],
		});

		if (yearsOfExperience !== undefined)
			candidateSkill.yearsOfExperience = yearsOfExperience;
		if (proficiencyLevel !== undefined)
			candidateSkill.proficiencyLevel = proficiencyLevel;

		return repository.save(candidateSkill);
	}

	@Mutation(() => Boolean)
	async deleteCandidateSkill(
		@Arg("id", () => ID) id: string
	): Promise<boolean> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		await repository.delete(id);
		return true;
	}
}
