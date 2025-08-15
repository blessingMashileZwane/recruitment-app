import { AsyncLocalStorage } from "async_hooks";
import { Request } from "express";
import jwt from "jsonwebtoken";

export interface MyContext {
	user?: {
		id: string;
		role: "ADMIN" | "USER" | "GUEST";
	};
}

export const userContext = new AsyncLocalStorage<{ userId: string }>();

export function getCurrentUserId(): string | undefined {
	return userContext.getStore()?.userId;
}

export async function buildContext({ req }: { req: Request }) {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.replace("Bearer ", "");

	let userId = "system";
	let role: "ADMIN" | "USER" | "GUEST" = "GUEST";

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
		userId = decoded.sub ?? decoded.userId ?? "system";
		role = decoded.role ?? "GUEST";
	} catch {}

	return await new Promise((resolve) => {
		userContext.run({ userId }, () => {
			resolve({ user: { id: userId, role } });
		});
	});
}
