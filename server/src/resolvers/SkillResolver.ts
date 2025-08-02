import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { SkillEntity } from "../entities";
import { DataSource } from "typeorm";

@Resolver(() => SkillEntity)
export class SkillResolver {
	constructor(private dataSource: DataSource) {}

	@Query(() => [SkillEntity])
	async skills(): Promise<SkillEntity[]> {
		const repository = this.dataSource.getRepository(SkillEntity);
		return repository.find();
	}

	@Query(() => SkillEntity, { nullable: true })
	async skill(@Arg("id", () => ID) id: string): Promise<SkillEntity | null> {
		const repository = this.dataSource.getRepository(SkillEntity);
		return repository.findOne({ where: { id } });
	}

	@Mutation(() => SkillEntity)
	async createSkill(
		@Arg("name") name: string,
		@Arg("category", { nullable: true }) category?: string
	): Promise<SkillEntity> {
		const repository = this.dataSource.getRepository(SkillEntity);
		const skill = repository.create({ name, category });
		return repository.save(skill);
	}

	@Mutation(() => SkillEntity)
	async updateSkill(
		@Arg("id", () => ID) id: string,
		@Arg("name", { nullable: true }) name?: string,
		@Arg("category", { nullable: true }) category?: string
	): Promise<SkillEntity> {
		const repository = this.dataSource.getRepository(SkillEntity);
		const skill = await repository.findOneOrFail({ where: { id } });

		if (name) skill.name = name;
		if (category !== undefined) skill.category = category;

		return repository.save(skill);
	}

	@Mutation(() => Boolean)
	async deleteSkill(@Arg("id", () => ID) id: string): Promise<boolean> {
		const repository = this.dataSource.getRepository(SkillEntity);
		await repository.delete(id);
		return true;
	}
}
