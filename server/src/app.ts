import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { permissions } from "./shields/permissions";

import { applyMiddleware } from "graphql-middleware";
import { getDataSource } from "./config";
import { buildContext, contextMiddleware } from "./middleware";
import {
	CandidateResolver,
	CandidateSkillResolver,
	InterviewStageResolver,
	JobApplicationResolver,
	FullCandidateResolver,
} from "./resolvers";

async function bootstrap() {
	const dataSource = await getDataSource();

	const schema = await buildSchema({
		resolvers: [
			CandidateResolver,
			CandidateSkillResolver,
			JobApplicationResolver,
			InterviewStageResolver,
			FullCandidateResolver,
		],
		container: { get: (cls) => new cls(dataSource) },
		validate: false,
	});

	const permissionsSchema = applyMiddleware(schema, permissions);

	const server = new ApolloServer({
		schema: permissionsSchema,
		context: buildContext,
	});

	const app = express();

	await server.start();

	app.use(express.json());
	app.use(contextMiddleware);

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
