import { MovieDBAdapter } from "../adapters/moviedb.adapter";
import { Movie } from "../entities/movie.entity";
import { AsyncUseCase } from "./use-case";

export type SearchMoviesUseCase = AsyncUseCase<
  { searchTerm: string; page?: number },
  { movies: Movie[]; pagination: { page: number; totalPages: number } }
>;

export type SearchMoviesUseCaseDependencies = {
  movieDBAdapter: MovieDBAdapter;
};

export const searchMoviesUseCaseFactory: (
  deps: SearchMoviesUseCaseDependencies,
) => SearchMoviesUseCase =
  ({ movieDBAdapter }) =>
  async ({ searchTerm, page }) => {
    const searchResults = await movieDBAdapter.searchMovies({
      searchTerm,
      page: page ?? 1,
    });
    return {
      movies: searchResults.results,
      pagination: {
        page: searchResults.page,
        totalPages: searchResults.totalPages,
      },
    };
  };
