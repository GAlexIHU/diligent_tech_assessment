import { z } from "zod";

export const MovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  overview: z.string(),
  posterPath: z.string(),
});

export type Movie = z.infer<typeof MovieSchema>;
