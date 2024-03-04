import { CacheAdapter } from "../adapters/cache.adapter";
import { MovieDBAdapter } from "../adapters/moviedb.adapter";
import { Movie } from "../entities/movie.entity";
import { AsyncUseCase } from "./use-case";

export type SearchMoviesUseCase = AsyncUseCase<
  { searchTerm: string; page: number },
  {
    movies: Movie[];
    pagination: { page: number; totalPages: number };
    cached: boolean;
  }
>;

export type SearchMoviesUseCaseDependencies = {
  movieDBAdapter: MovieDBAdapter;
  cacheAdapter: CacheAdapter;
};

export const searchMoviesUseCaseFactory: (
  deps: SearchMoviesUseCaseDependencies,
) => SearchMoviesUseCase =
  ({ movieDBAdapter, cacheAdapter }) =>
  async ({ searchTerm, page }) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const getCacheKey = (searchTerm: string, page: number) =>
      `search:${searchTerm}:${page}`;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const getCacheHitCountKey = (searchTerm: string, page: number) =>
      `search:${searchTerm}:${page}:hits`;

    const cachedResults = await cacheAdapter.get<{
      movies: Movie[];
      pagination: { page: number; totalPages: number };
    }>(getCacheKey(searchTerm, page));

    if (cachedResults) {
      // increment cache hit count
      const cacheHitCount = await cacheAdapter.get<number>(
        getCacheHitCountKey(searchTerm, page),
      );
      if (cacheHitCount) {
        await cacheAdapter.set(
          getCacheHitCountKey(searchTerm, page),
          cacheHitCount + 1,
        );
      } else {
        await cacheAdapter.set(getCacheHitCountKey(searchTerm, page), 1);
      }
      return {
        movies: cachedResults.movies,
        pagination: {
          page: cachedResults.pagination.page,
          totalPages: cachedResults.pagination.totalPages,
        },
        cached: true,
      };
    }

    const searchResults = await movieDBAdapter.searchMovies({
      searchTerm,
      page: page,
    });

    // add to cache
    await cacheAdapter.set(
      getCacheKey(searchTerm, page),
      {
        movies: searchResults.results,
        pagination: {
          page: searchResults.page,
          totalPages: searchResults.totalPages,
        },
      },
      60 * 2,
    );

    // set cache hit count
    await cacheAdapter.set(getCacheHitCountKey(searchTerm, page), 0);
    return {
      movies: searchResults.results,
      pagination: {
        page: searchResults.page,
        totalPages: searchResults.totalPages,
      },
      cached: false,
    };
  };
