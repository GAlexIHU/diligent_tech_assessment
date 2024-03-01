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
    }),
    responses: {
      200: z.object({
        results: z.array(MovieSchema),
      }),
    },
    summary: "Search for movies",
  },
});
