import "./App.css";
import { api } from "@repo/api/v1";
import { initQueryClient } from "@ts-rest/react-query";
import { useState } from "react";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";

const client = initQueryClient(api, {
  baseUrl: "http://localhost:3001",
  baseHeaders: {},
});

function App() {
  const [count, setCount] = useState(0);

  const result = client.movie.getMovies.useQuery([Math.random()], {
    query: { searchTerm: "1234" },
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 2)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button
          onClick={() => {
            result.refetch({ throwOnError: true });
          }}
        >
          query
        </button>
        <p>{JSON.stringify(result, null, 2)}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
