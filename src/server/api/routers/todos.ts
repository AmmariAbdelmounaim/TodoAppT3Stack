import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { contextProps } from "@trpc/react-query/shared";

export const todosRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todos.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({ content: z.string(), description: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todos.create({
        data: {
          content: input.content,
          description: input.description,
          userId: ctx.session.user.id,
          done: false,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todos.delete({
        where: {
          id: input.id,
        },
      });
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().optional(),
        description: z.string().optional(),
        done: z.boolean().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todos.update({
        where: {
          id: input.id,
        },
        data: {
          ...(input.content != null && { content: input.content }),
          ...(input.description != null && { description: input.description }),
          ...(input.done != null && { done: input.done }),
        },
      });
    }),
});
