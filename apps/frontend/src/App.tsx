import "./App.css";
import { api } from "@repo/api/v1";
import { initQueryClient } from "@ts-rest/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import MovieCard from "./components/app/movie-card";
import PaginationBar from "./components/app/pagination-bar";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { usePagination } from "./hooks/use-pagination";

const client = initQueryClient(api, {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  baseHeaders: {},
});

const formSchema = z.object({
  searchTerm: z.string().min(3, "Search term must be at least 3 characters"),
});

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const { page, setPage, setTotalPages, totalPages } = usePagination(1, 1);

  const handleSearchTermChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setTotalPages(1);
      setSearchTerm(e.target.value);
    },
    [setPage, setTotalPages, setSearchTerm],
  );

  const queryKeys = useDebounce([searchTerm, page], 700);

  const result = client.movie.getMovies.useQuery(
    ["movies", ...queryKeys],
    {
      query: { searchTerm, page },
    },
    {
      queryKey: ["movies", ...queryKeys],
      retry: (_, error) => error.status !== 400,
      enabled: formSchema.safeParse({ searchTerm: queryKeys[0] }).success,
      placeholderData: (previous) => previous,
    },
  );

  useEffect(() => {
    if (result.isSuccess) {
      window.scrollTo({ top: 0, behavior: "instant" });
      setTotalPages(result.data.body.totalPages);
    }
  }, [result.data?.body]);

  const cacheIndicatorFragment = useMemo(() => {
    if (result.isSuccess) {
      return (
        <div className="text-sm text-gray-500 my-2">
          {result.data.body.cached ? "Cached" : "Fetched"}
        </div>
      );
    }
    return null;
  }, [result.data?.body.cached, result.isSuccess]);

  return (
    <>
      <div className="mx-auto container">
        <h1 className="text-4xl font-bold text-center my-10">
          MovieDB Movie Search
        </h1>
        <div className="flex items-center gap-4 mx-auto">
          <Input
            value={searchTerm}
            onChange={handleSearchTermChange}
            alt="search"
          />
          <Button onClick={() => result.refetch()}>Search</Button>
        </div>
        <div className="">
          {result.isLoading && <div>Loading...</div>}
          {result.isError && <div>Error: {result.error.status}</div>}
          {cacheIndicatorFragment}
        </div>
        <div>
          {result.isSuccess && (
            <div className="mx-auto my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {result.data.body.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
          {result.isSuccess && result.data.body.results.length === 0 && (
            <p>No movies found!</p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-2">
            <PaginationBar
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
