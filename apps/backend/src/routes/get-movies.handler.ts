import { api } from "@repo/api/v1";
import z from "zod";
import { Movie } from "../entities/movie.entity";
import { Cacher } from "../framework/cached";
import { runInContext } from "../framework/context";
import { Logger } from "../framework/logger";
import { SearchMoviesUseCase } from "../use-cases/search-movies.use-case";
import { AsyncUseCaseInput, AsyncUseCaseOutput } from "../use-cases/use-case";
import { RouteHandler } from "./route";

export const getMoviesRouteHandlerFactory: (deps: {
  searchMoviesUseCase: SearchMoviesUseCase;
  cache: Cacher;
}) => RouteHandler<typeof api.movie.getMovies> =
  ({ searchMoviesUseCase, cache }) =>
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

    const { value, cached } = await runInContext(
      { logger: request.log as unknown as Logger },
      cache<
        AsyncUseCaseInput<SearchMoviesUseCase>,
        AsyncUseCaseOutput<SearchMoviesUseCase>
      >(searchMoviesUseCase),
    )({ searchTerm, page: page ?? 1 });

    return {
      status: 200,
      body: {
        results: value.movies.map(mapMovie),
        page: value.pagination.page,
        totalPages: value.pagination.totalPages,
        cached: cached,
      },
    };
  };
