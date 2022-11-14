import Fastify, { FastifyInstance } from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { auth } from "./routes/auth";
import { guess } from "./routes/guess";
import { pool } from "./routes/pool";
import { user } from "./routes/user";
import { game } from "./routes/game";



const start = async () => {
  const fastify: FastifyInstance = Fastify({
    logger: true
  });

  await fastify.register(cors, {
    origin: true
  });

  await fastify.register(jwt, {
    secret: 'nlwcopa'
  });

  await fastify.register(auth);
  await fastify.register(game);
  await fastify.register(guess);
  await fastify.register(pool);
  await fastify.register(user);


  try {
    await fastify.listen({ port: 3333, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();