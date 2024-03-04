import { z } from "zod";

export const MovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  overview: z.string(),
  releaseDate: z.string().optional(),
  image: z.string().optional(),
  popularity: z.number().optional(),
});

export type Movie = z.infer<typeof MovieSchema>;
