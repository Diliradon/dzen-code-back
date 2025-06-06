import { FastifyInstance } from "fastify";
import { sessionsHandler } from "./sessions.handler.js";
import {
    getActiveSessionsCountResponseSchema,
    getActiveSessionsResponseSchema,
} from "@/lib/validation/sessions/sessions.schema.js";

export const sessionsRoutes = async (fastify: FastifyInstance) => {
    fastify.get(
        "/count",
        {
            schema: {
                tags: ["sessions"],
                summary: "Get the count of active sessions",
                description:
                    "Returns the current number of active WebSocket sessions",
                response: {
                    200: getActiveSessionsCountResponseSchema,
                    500: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            error: { type: "string" },
                        },
                    },
                },
            },
        },
        sessionsHandler.getActiveSessionsCount
    );

    fastify.get(
        "/",
        {
            schema: {
                tags: ["sessions"],
                summary: "Get detailed information about all active sessions",
                description:
                    "Returns detailed information about all currently active WebSocket sessions",
                response: {
                    200: getActiveSessionsResponseSchema,
                    500: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            error: { type: "string" },
                        },
                    },
                },
            },
        },
        sessionsHandler.getActiveSessions
    );
};
