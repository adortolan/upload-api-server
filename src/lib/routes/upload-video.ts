import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25,
    },
  });
  app.post("/videos", async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "Missing file input." });
    }

    const extension = path.extname(data.filename);

    if (extension !== ".mp3") {
      return reply
        .status(400)
        .send({ error: "Invalid input type, please upload a MP3." });
    }

    const fileBaseName = path.basename(data.filename, extension);
    const fileUpLoadName = `${fileBaseName}-${randomUUID()}${extension}`;
    const upLoadDestination = path.resolve(
      __dirname,
      "../../tmp",
      fileUpLoadName
    );

    await pump(data.file, fs.createWriteStream(upLoadDestination));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: upLoadDestination,
      },
    });

    return { video };
  });
}
