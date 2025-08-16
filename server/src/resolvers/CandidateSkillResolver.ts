import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { CandidateSkillEntity } from "../entities";
import { DataSource } from "typeorm";
import { CandidateSkillOutput } from "../types/outputs";
import { HistoryService, runTransaction } from "../utils";
import { UpdateCandidateSkillInput } from "../types/inputs";

@Resolver(() => CandidateSkillEntity)
export class CandidateSkillResolver {
	private historyService: HistoryService;
	constructor(private dataSource: DataSource) {
		this.historyService = new HistoryService(this.dataSource);
	}

	@Query(() => [CandidateSkillOutput])
	async candidateSkills(): Promise<CandidateSkillOutput[]> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		return repository.find({
			relations: ["candidate", "skill"],
		});
	}

	@Query(() => CandidateSkillOutput)
	async getCandidateSkillById(
		@Arg("id", () => ID) id: string
	): Promise<CandidateSkillOutput | null> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		return repository.findOne({
			where: { id },
		});
	}

	@Query(() => [CandidateSkillOutput])
	async candidateSkillsByCandidate(
		@Arg("candidateId", () => ID) candidateId: string
	): Promise<CandidateSkillOutput[]> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		return repository.find({
			where: { candidate: { id: candidateId } },
		});
	}

	@Mutation(() => CandidateSkillOutput)
	async createCandidateSkill(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("university", () => ID) university: string,
		@Arg("yearsOfExperience") yearsOfExperience: number,
		@Arg("proficiencyLevel") proficiencyLevel: number,
		@Arg("qualification", () => String, { nullable: true })
		qualification?: string
	): Promise<CandidateSkillOutput> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		const candidateSkill = repository.create({
			candidateId,
			university,
			yearsOfExperience,
			proficiencyLevel,
			qualification,
		});

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(candidateSkill);
			await this.historyService.createHistoryRecord(
				candidateSkill,
				"CandidateSkillEntity",
				"CREATE",
				manager
			);
			return response;
		});
	}

	@Mutation(() => CandidateSkillOutput)
	async updateCandidateSkill(
		@Arg("input") input: UpdateCandidateSkillInput
	): Promise<CandidateSkillOutput> {
		const { id, yearsOfExperience, proficiencyLevel } = input;

		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		const candidateSkill = await repository.findOneOrFail({ where: { id } });

		if (yearsOfExperience !== undefined) {
			candidateSkill.yearsOfExperience = yearsOfExperience;
		}
		if (proficiencyLevel !== undefined) {
			candidateSkill.proficiencyLevel = proficiencyLevel;
		}

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(candidateSkill);
			await this.historyService.createHistoryRecord(
				candidateSkill,
				"CandidateSkillEntity",
				"UPDATE",
				manager
			);
			return response;
		});
	}
	@Mutation(() => CandidateSkillOutput)
	async updateCandidateSkillByCandidateId(
		@Arg("candidateId", () => ID) candidateId: string,
		@Arg("yearsOfExperience", { nullable: true }) yearsOfExperience?: number,
		@Arg("proficiencyLevel", { nullable: true }) proficiencyLevel?: number
	): Promise<CandidateSkillOutput> {
		const repository = this.dataSource.getRepository(CandidateSkillEntity);
		const candidateSkill = await repository.findOneOrFail({
			where: { candidateId },
			relations: ["candidate", "skill"],
		});

		if (yearsOfExperience !== undefined)
			candidateSkill.yearsOfExperience = yearsOfExperience;
		if (proficiencyLevel !== undefined)
			candidateSkill.proficiencyLevel = proficiencyLevel;

		return runTransaction(this.dataSource, async (manager) => {
			const response = await manager.save(candidateSkill);
			await this.historyService.createHistoryRecord(
				candidateSkill,
				"CandidateSkillEntity",
				"UPDATE",
				manager
			);
			return response;
		});
	}

	@Mutation(() => Boolean)
	async deleteCandidateSkill(
		@Arg("id", () => ID) id: string
	): Promise<boolean> {
		return runTransaction(this.dataSource, async (manager) => {
			await manager.delete(CandidateSkillEntity, id);
			await this.historyService.createHistoryRecord(
				{ id },
				"CandidateSkillEntity",
				"DELETE",
				manager
			);
			return true;
		});
	}
}
