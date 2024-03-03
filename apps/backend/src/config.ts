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
      env: "MOVIEDB_URL",
    },
  },
});

type OfConfig<T> = T extends convict.Config<infer U> ? U : never;

export type Config = OfConfig<typeof config>;

export const getConfig = (): Config => {
  config.validate({ allowed: "strict" });
  return config.getProperties();
};
