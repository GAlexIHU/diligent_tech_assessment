import cors from "@fastify/cors";
import { api } from "@repo/api/v1";
import { initServer } from "@ts-rest/fastify";
import fastify, { FastifyInstance } from "fastify";
import { createClient, RedisClientType } from "redis";
import packageJson from "../package.json";
import { redisServiceFactory } from "./adapters/cache.adapter";
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
  const redisClient = createClient({
    url: config.redis.url,
  }) as RedisClientType;

  const server = fastify({
    logger: rootLogger.child({ module: packageJson.name }),
  });

  const movieDbService = movieDBServiceFactory(
    {
      config: {
        apiKey: config.moviedb.apiKey,
        baseUrl: config.moviedb.url,
        imageBaseUrl: config.moviedb.imageBaseUrl,
      },
    },
    { getLogger: () => getFromContext("logger") },
  );

  const redisService = redisServiceFactory(
    {
      redisClient: redisClient,
    },
    {
      getLogger: () => getFromContext("logger"),
    },
  );

  const searchMoviesUseCase = searchMoviesUseCaseFactory({
    movieDBAdapter: movieDbService,
    cacheAdapter: redisService,
  });

  const router = s.router(api, {
    movie: s.router(api.movie, {
      getMovies: getMoviesRouteHandlerFactory({ searchMoviesUseCase }),
    }),
  });

  return {
    run: async () => {
      try {
        await redisClient.connect();
        await server.register(cors, {});
        await server.register(s.plugin(router));
        await server.ready();
        server.listen({ port: config.port, host: "0.0.0.0" });
      } catch (error) {
        server.log.error(error);
        throw error;
      }
    },
    server: server.server,
  };
};
