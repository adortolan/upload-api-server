import { fastify } from "fastify";
import { prisma } from "./lib/prisma";
import { getAllPromptsRoute } from "./lib/routes/get-all-prompts";
import { uploadVideoRoute } from "./lib/routes/upload-video";
import { createTranscriptionRoute } from "./lib/routes/create-transcription";
import { generateIACompletionRoute } from "./lib/routes/generate-ai-completion";
import { fastifyCors } from "@fastify/cors";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateIACompletionRoute);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });
