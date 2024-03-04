import { expect, test, vi } from "vitest";
import { MovieDBAdapter } from "../adapters/moviedb.adapter";
import { searchMoviesUseCaseFactory } from "./search-movies.use-case";

const mockAdapter: MovieDBAdapter = {
  searchMovies: vi.fn().mockImplementation(() => ({
    page: 1,
    results: [],
    totalPages: 1,
  })),
};

const usecase = searchMoviesUseCaseFactory({ movieDBAdapter: mockAdapter });

test("should call the adapter with the correct parameters", async () => {
  await usecase({ searchTerm: "test", page: 1 });
  expect(mockAdapter.searchMovies).toHaveBeenCalledWith({
    searchTerm: "test",
    page: 1,
  });
});

test("should return the results from the adapter", async () => {
  const result = await usecase({ searchTerm: "test", page: 1 });
  expect(result).toEqual({
    movies: [],
    pagination: { page: 1, totalPages: 1 },
  });
});
