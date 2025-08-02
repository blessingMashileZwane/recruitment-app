import { rule, shield, and } from "graphql-shield";

const isAuthenticated = rule()((parent, args, ctx) => {
	return ctx.user !== undefined;
});

const isAdmin = rule()((parent, args, ctx) => {
	return ctx.user?.role === "ADMIN";
});

const isUser = rule()((parent, args, ctx) => {
	return ctx.user?.role === "USER";
});

export const permissions = shield({
	Query: {
		// me: isAuthenticated,
		// adminData: isAdmin,
	},
	Mutation: {
		createCandidate: and(isAuthenticated, isUser),
		deleteCandidate: isAdmin,
	},
});
