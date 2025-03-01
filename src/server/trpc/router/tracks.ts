import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const tracksRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.track.findMany({
      /**
       * TODO Change this to include a count of entries
       * https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing#filter-the-relation-count
       * The docs dont work for me. MongoDB problem?
       */
      include: {
        entries: {
          select: {
            id: true,
          },
        },
      },
    });
  }),
  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.track.findFirst({
      where: {
        id: input,
      },
    });
  }),
  getByIdIncludeRelations: publicProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.prisma.track.findFirst({
        where: {
          id: input,
        },
        include: {
          entries: {
            include: {
              car: true,
              user: true,
            },
          },
        },
      });
    }),
  getAllCategories: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.track
      .findMany({
        distinct: ["category"],
        select: {
          category: true,
        },
      })
      .then((data) => {
        const result: string[] = [];
        data.forEach((queryResult) => result.push(queryResult.category));
        return result;
      });
  }),
});
