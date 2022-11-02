import { FastifyInstance, RouteShorthandOptions, DoneFuncWithErrOrRes} from "fastify";
import { prisma } from "../services/prisma";

export default function pools(fastify: FastifyInstance, options: RouteShorthandOptions, done: DoneFuncWithErrOrRes) {
  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();
    return { count }
  });

  done();
}