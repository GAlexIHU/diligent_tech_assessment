import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { MovieSchema } from "./movie-schema";

const c = initContract();

export const movieContract = c.router({
  getMovies: {
    method: "GET",
    path: `/movies`,
    query: z.object({
      searchTerm: z.string().min(3),
      page: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({
        cached: z.boolean(),
        results: z.array(MovieSchema),
        page: z.number(),
        totalPages: z.number(),
      }),
    },
    summary: "Search for movies",
    validateResponseOnClient: true,
  },
});
