import Fastify, { FastifyInstance } from "fastify";
import pools from "./routes/pools";
import cors from '@fastify/cors';

const start = async () => {
  const fastify: FastifyInstance = Fastify({
    logger: true
  });

  await fastify.register(cors, {
    origin: true
  })

  /* tslint:disable-next-line */
  await fastify.register(pools);

  try {
    await fastify.listen({ port: 3333, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();