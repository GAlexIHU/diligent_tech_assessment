import { initContract } from "@ts-rest/core";
import { movieContract } from "./movie";

const c = initContract();

export type * from "./movie";

export const api = c.router({
  movie: movieContract,
});
