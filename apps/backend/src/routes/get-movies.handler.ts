import { api } from "@repo/api/v1";
import z from "zod";
import { Movie } from "../entities/movie.entity";
import { runInContext } from "../framework/context";
import { Logger } from "../framework/logger";
import { SearchMoviesUseCase } from "../use-cases/search-movies.use-case";
import { RouteHandler } from "./route";

export const getMoviesRouteHandlerFactory: (deps: {
  searchMoviesUseCase: SearchMoviesUseCase;
}) => RouteHandler<typeof api.movie.getMovies> =
  ({ searchMoviesUseCase }) =>
  async ({ query: { searchTerm, page }, request }) => {
    type EOf<T> = T extends (infer E)[] ? E : never;
    type APIMovie = EOf<
      z.infer<(typeof api.movie.getMovies.responses)["200"]>["results"]
    >;
    const mapMovie = (movie: Movie): APIMovie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      image: movie.image,
      popularity: movie.popularity,
    });

    const searchResults = await runInContext(
      { logger: request.log as unknown as Logger },
      searchMoviesUseCase,
    )({ searchTerm, page: page ?? 1 });

    return {
      status: 200,
      body: {
        results: searchResults.movies.map(mapMovie),
        page: searchResults.pagination.page,
        totalPages: searchResults.pagination.totalPages,
        cached: searchResults.cached,
      },
    };
  };
