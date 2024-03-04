import z from "zod";

export const movieDbMovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string().nullable(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number().nullable(),
  vote_count: z.number().nullable(),
});
export type MovieDBMovie = z.infer<typeof movieDbMovieSchema>;
