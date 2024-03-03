import cors from "@fastify/cors";
import { api } from "@repo/api/v1";
import { initServer } from "@ts-rest/fastify";
import fastify, { FastifyInstance } from "fastify";
import packageJson from "../package.json";
import { movieDBServiceFactory } from "./adapters/moviedb.adapter";
import { Config } from "./config";
import { getFromContext } from "./framework/context";
import { rootLogger } from "./framework/logger";
import { getMoviesRouteHandlerFactory } from "./routes/get-movies.handler";
import { searchMoviesUseCaseFactory } from "./use-cases/search-movies.use-case";

const s = initServer();

interface App {
  run: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  server: FastifyInstance<any, any, any, any, any>["server"];
}

export const createApp = (config: Config): App => {
  const server = fastify({
    logger: rootLogger.child({ module: packageJson.name }),
  });

  const movieDbService = movieDBServiceFactory(
    {
      config: {
        apiKey: config.moviedb.apiKey,
        baseUrl: config.moviedb.url,
      },
    },
    { getLogger: () => getFromContext("logger") },
  );

  const searchMoviesUseCase = searchMoviesUseCaseFactory({
    movieDBAdapter: movieDbService,
  });

  const router = s.router(api, {
    movie: s.router(api.movie, {
      getMovies: getMoviesRouteHandlerFactory({ searchMoviesUseCase }),
    }),
  });

  return {
    run: async () => {
      try {
        await server.register(cors, {});
        await server.register(s.plugin(router));
        await server.ready();
        server.listen({ port: config.port });
      } catch (error) {
        server.log.error(error);
        throw error;
      }
    },
    server: server.server,
  };
};
