import { createTRPCRouter } from "./trpc";
import { todosRouter } from "./routers/todos";

export const appRouter = createTRPCRouter({
  todos: todosRouter,
});

export type AppRouter = typeof appRouter;
