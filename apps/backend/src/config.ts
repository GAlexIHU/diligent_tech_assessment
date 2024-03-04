import convict from "convict";

const config = convict({
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 3000,
    env: "PORT",
  },
  moviedb: {
    apiKey: {
      doc: "The API key for The Movie Database.",
      format: String,
      default: null as unknown as string,
      env: "MOVIEDB_API_KEY",
    },
    url: {
      doc: "The URL for The Movie Database.",
      format: String,
      default: "https://api.themoviedb.org/3",
      env: "MOVIEDB_API_URL",
    },
    imageBaseUrl: {
      doc: "The base URL for images from The Movie Database.",
      format: String,
      default: "https://image.tmdb.org/t/p",
      env: "MOVIEDB_IMAGE_BASE_URL",
    },
  },
  redis: {
    url: {
      doc: "The URL for the Redis server.",
      format: String,
      default: "redis://localhost:6379",
      env: "REDIS_URL",
    },
  },
  cacheSeconds: {
    doc: "The number of seconds to cache data.",
    format: "int",
    default: 120,
    env: "CACHE_SECONDS",
  },
});

type OfConfig<T> = T extends convict.Config<infer U> ? U : never;

export type Config = OfConfig<typeof config>;

export const getConfig = (): Config => {
  config.validate({ allowed: "strict" });
  return config.getProperties();
};
