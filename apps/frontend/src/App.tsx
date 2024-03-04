import "./App.css";
import { api } from "@repo/api/v1";
import { initQueryClient } from "@ts-rest/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { z } from "zod";
import MovieCard from "./components/app/movie-card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const client = initQueryClient(api, {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  baseHeaders: {},
});

const formSchema = z.object({
  searchTerm: z.string().min(3, "Search term must be at least 3 characters"),
});

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryKeys = useDebounce([searchTerm], 700);

  const result = client.movie.getMovies.useQuery(
    ["movies", ...queryKeys],
    {
      query: { searchTerm },
    },
    {
      queryKey: ["movies", ...queryKeys],
      retry: (_, error) => error.status !== 400,
      enabled: formSchema.safeParse({ searchTerm: queryKeys[0] }).success,
      placeholderData: (previous) => previous,
    },
  );

  return (
    <>
      <div className="mx-auto">
        <div className="flex items-center gap-4 mx-auto container">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            alt="search"
          />
          <Button onClick={() => result.refetch()}>Search</Button>
        </div>
        <div>
          {result.isLoading && <div>Loading...</div>}
          {result.isError && <div>Error: {result.error.status}</div>}
          {result.isSuccess && (
            <div className="container mx-auto my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.data.body.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
          {result.isSuccess && result.data.body.results.length === 0 && (
            <p>No movies found!</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
