import { join } from "path";
import { URL } from "url";
import z from "zod";
import { Movie } from "../entities/movie.entity";
import { Logger } from "../framework/logger";
import { Lazy } from "../types/lazy";
import { PaginatedSearchResult } from "../types/paginated-search";
import { MovieDBMovie, movieDbMovieSchema } from "./moviedb.schema";

export interface MovieDBAdapter {
  searchMovies: (props: {
    searchTerm: string;
    page: number;
  }) => Promise<PaginatedSearchResult<Movie>>;
}

interface MovieDBServiceConfig {
  apiKey: string;
  baseUrl: string;
  imageBaseUrl: string;
}

export class MovieDBError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const movieDBServiceFactory: (
  deps: {
    config: MovieDBServiceConfig;
  },
  layzDeps: Lazy<{
    logger: Logger;
  }>,
) => MovieDBAdapter = ({ config }, { getLogger }) => {
  const movieFromMovieDBMovie = (movieDBMovie: MovieDBMovie): Movie => ({
    id: movieDBMovie.id.toString(),
    title: movieDBMovie.title,
    overview: movieDBMovie.overview,
    releaseDate: movieDBMovie?.release_date ?? undefined,
    image: movieDBMovie?.backdrop_path
      ? join(config.imageBaseUrl, "/original", movieDBMovie.backdrop_path)
      : undefined,
    popularity: movieDBMovie?.vote_average ?? undefined,
  });

  return {
    searchMovies: async ({ searchTerm, page }) => {
      try {
        getLogger().info(`Searching movies for "${searchTerm}"`);
        const searchResultSchema = z
          .object({
            page: z.number(),
            results: z.array(movieDbMovieSchema),
            total_pages: z.number(),
            total_results: z.number(),
          })
          .strict();

        const url = new URL(join(config.baseUrl, "/search/movie"));
        url.searchParams.append("query", searchTerm);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("api_key", config.apiKey);

        const apiResponse = await fetch(url.href, {
          headers: { Accept: "application/json" },
          method: "GET",
        });
        if (!apiResponse.ok) {
          throw new MovieDBError(
            `Failed to fetch movies: ${apiResponse.status} ${apiResponse.statusText}`,
          );
        }
        const apiResponseJson = await apiResponse.json();

        const searchResult = searchResultSchema.parse(apiResponseJson);
        return {
          page: searchResult.page,
          results: searchResult.results.map(movieFromMovieDBMovie),
          totalPages: searchResult.total_pages,
          totalResults: searchResult.total_results,
        };
      } catch (error) {
        getLogger().error("Failed to search movies", error);
        if (error instanceof MovieDBError) {
          throw error;
        }
        if (error instanceof z.ZodError) {
          throw new MovieDBError("Invalid API response, validation failed");
        }
        throw new MovieDBError("UNKNOWN ERROR");
      }
    },
  };
};
