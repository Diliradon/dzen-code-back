import type { FastifyReply, FastifyRequest } from "fastify";

interface SessionsHandler {
    getActiveSessionsCount: (
        request: FastifyRequest,
        reply: FastifyReply
    ) => Promise<void>;
    getActiveSessions: (
        request: FastifyRequest,
        reply: FastifyReply
    ) => Promise<void>;
}

const sessionsHandler: SessionsHandler = {
    async getActiveSessionsCount(request: FastifyRequest, reply: FastifyReply) {
        try {
            const count =
                request.server.sessionManager.getActiveSessionsCount();

            await reply.status(200).send({
                message: "Active sessions count retrieved successfully",
                data: {
                    activeSessionsCount: count,
                    timestamp: new Date().toISOString(),
                },
            });
        } catch (error) {
            request.log.error("Error getting active sessions count:", error);

            await reply.status(500).send({
                message: "Internal server error",
                error: "Failed to retrieve active sessions count",
            });
        }
    },

    async getActiveSessions(request: FastifyRequest, reply: FastifyReply) {
        try {
            const sessions =
                request.server.sessionManager.getAllActiveSessions();

            await reply.status(200).send({
                message: "Active sessions retrieved successfully",
                data: {
                    sessions,
                    totalCount: sessions.length,
                    timestamp: new Date().toISOString(),
                },
            });
        } catch (error) {
            request.log.error("Error getting active sessions:", error);

            await reply.status(500).send({
                message: "Internal server error",
                error: "Failed to retrieve active sessions",
            });
        }
    },
};

export { sessionsHandler };
