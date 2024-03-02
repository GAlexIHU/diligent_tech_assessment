import cors from "@fastify/cors";
import { api } from "@repo/api/v1";
import { initServer } from "@ts-rest/fastify";
import fastify from "fastify";
import pino from "pino";
import { z } from "zod";
import packageJson from "../package.json";

const rootLogger = pino();

const app = fastify({
  logger: rootLogger.child({ module: packageJson.name }),
});

const s = initServer();

const router = s.router(api, {
  movie: s.router(api.movie, {
    getMovies: async () => {
      type Response200 = z.infer<(typeof api.movie.getMovies.responses)["200"]>;

      const results: Response200["results"] = [];
      return {
        status: 200,
        body: {
          results,
        },
      };
    },
  }),
});

app.register(cors, {});
app.register(s.plugin(router));

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
