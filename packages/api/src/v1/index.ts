import { initContract } from "@ts-rest/core";
import { movieContract } from "./movie";

const c = initContract();

export const api = c.router({
  movie: movieContract,
});
