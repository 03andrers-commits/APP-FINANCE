import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  // Health check
  health: publicProcedure.query(() => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  })),

  // Auth endpoints
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
  }),

  // TODO: add feature routers here, e.g.
  // finance: router({
  //   transactions: protectedProcedure.query(({ ctx }) =>
  //     db.getTransactions(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
