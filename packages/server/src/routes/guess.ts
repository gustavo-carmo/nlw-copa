import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugin/authenticate";

export async function guess(fastify: FastifyInstance) {
   fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count }
  });

  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate]    
  }, async (request, reply) => {
    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string(),
    });

    const createGuessBody = z.object({
      firstTeamPoints: z.string(),
      secondTeamPoints: z.string(),
    });

    const { gameId, poolId } = createGuessParams.parse(request.params);
    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body);

    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          poolId,
          userId: request.user.sub
        }
      }
    });

    if (!participant) {
      return reply.status(400).send({
        message: "You're not allowed to create a guess inside this pool."
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          gameId,
          participantId: participant.id
        }
      }
    });

    
    if (guess) {
      return reply.status(400).send({
        message: "You already made a guess to this game on this pool."
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId
      }
    });

  
    if (!game) {
      return reply.status(400).send({
        message: "Game not found."
      })
    }

    if (game.date < new Date()) {
      return reply.status(400).send({
        message: "You cannot send guesses after the game date."
      })
    }


    await prisma.guess.create({
      data: {
        gameId,
        participantId: participant.id,
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      }
    })

    return reply.status(201).send();
  })
}