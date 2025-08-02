import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import {
	CandidateResolver,
	CandidateSkillResolver,
	JobPositionResolver,
	InterviewProgressResolver,
	InterviewStageResolver,
	SkillResolver,
} from "./resolvers";
import { getDataSource } from "./config";

async function bootstrap() {
	const dataSource = await getDataSource();

	const schema = await buildSchema({
		resolvers: [
			CandidateResolver,
			CandidateSkillResolver,
			JobPositionResolver,
			InterviewProgressResolver,
			InterviewStageResolver,
			SkillResolver,
		],
		container: { get: (cls) => new cls(dataSource) },
		validate: false,
	});

	const server = new ApolloServer({
		schema,
	});

	const app = express();

	await server.start();

	app.use(express.json());

	await new Promise<void>((resolve) => {
		server.applyMiddleware({
			app: app as any,
			path: "/graphql",
			cors: true,
		});
		resolve();
	});

	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(
			`Server running at http://localhost:${PORT}${server.graphqlPath}`
		);
	});
}

bootstrap().catch(console.error);
