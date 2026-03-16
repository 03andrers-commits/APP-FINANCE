import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export interface User {
  id: string;
  email?: string;
  name?: string;
}

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;

  // Extract user from request (via JWT token or session)
  const authHeader = opts.req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      // TODO: Verify JWT token using jsonwebtoken library
      // For now, just use the token as the user ID
      user = {
        id: token,
        email: undefined,
        name: undefined,
      };
    } catch (err) {
      // Invalid token, user stays null
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
