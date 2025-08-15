import { allow, rule, shield } from "graphql-shield";

const isAuthenticated = rule()((parent, args, ctx) => {
	return ctx.user !== undefined;
});

const isAdmin = rule()((parent, args, ctx) => {
	return ctx.user?.role === "ADMIN";
});

const isUser = rule()((parent, args, ctx) => {
	return ctx.user?.role === "USER";
});

export const permissions = shield(
	{
		Query: {
			"*": allow, // Allow all queries
		},
		Mutation: {
			"*": allow, // Allow all mutations
		},
		// Query: {
		// 	// me: isAuthenticated,
		// 	// adminData: isAdmin,
		// 	"*": rule()(() => true), // Allow all queries by default
		// },
		// Mutation: {
		// 	"*": rule()(() => true), // Allow all mutations by default
		// 	// createCandidate: and(isAuthenticated, isUser),
		// 	// deleteCandidate: isAdmin,
		// },
	},
	{
		fallbackRule: allow, // allow everything else by default
		debug: true, // helpful for debugging
	}
);
