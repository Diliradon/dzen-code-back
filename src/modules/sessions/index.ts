import { FastifyInstance } from "fastify";
import { sessionsRoutes } from "./sessions.route.js";

// Define the endpoint prefix by providing autoPrefix module property.
export const autoPrefix = "/api/sessions";

export default async function (fastify: FastifyInstance) {
    await fastify.register(sessionsRoutes);
}
