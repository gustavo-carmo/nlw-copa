import Fastify, { FastifyInstance } from "fastify";
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id';

export const prisma = new PrismaClient({
  log: ['query']
});

const start = async () => {
  const fastify: FastifyInstance = Fastify({
    logger: true
  });

  await fastify.register(cors, {
    origin: true
  })

  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count }
  });

  fastify.get("/users/count", async () => {
    const count = await prisma.user.count();
    return { count }
  });

  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();
    return { count }
  });

  fastify.post("/pools", async (request, reply) => {
    try {
      const createPoolBody = z.object({
        title: z.string()
      })

      const { title } = createPoolBody.parse(request.body);

      const generate = new ShortUniqueId({ length: 6});
      const code = (String(generate())).toUpperCase();

      await prisma.pool.create({
        data: {
          title,
          code
        }
      });


      return reply.status(201).send({ code });
    } catch (err) {
      return reply.status(400).send({ err });
    }
  });

  try {
    await fastify.listen({ port: 3333, host: '0.0.0.0' });
    // await fastify.listen({ port: 3333 });
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start();