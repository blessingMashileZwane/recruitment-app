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

export function buildContext({ req }: { req: Request }): MyContext {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.replace("Bearer ", "");

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
		return { user: { id: decoded.sub, role: decoded.role } };
	} catch {
		return {};
	}
}
