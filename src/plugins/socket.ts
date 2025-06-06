import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

interface ActiveSession {
    id: string;
    userId?: string;
    connectedAt: Date;
    userAgent?: string;
    ipAddress?: string;
}

class SessionManager {
    private activeSessions: Map<string, ActiveSession> = new Map();

    addSession(sessionId: string, session: ActiveSession): void {
        this.activeSessions.set(sessionId, session);
    }

    removeSession(sessionId: string): void {
        this.activeSessions.delete(sessionId);
    }

    updateSession(sessionId: string, updates: Partial<ActiveSession>): void {
        const session = this.activeSessions.get(sessionId);

        if (session) {
            this.activeSessions.set(sessionId, { ...session, ...updates });
        }
    }

    getActiveSessionsCount(): number {
        return this.activeSessions.size;
    }

    getAllActiveSessions(): ActiveSession[] {
        return Array.from(this.activeSessions.values());
    }

    getSessionsByUserId(userId: string): ActiveSession[] {
        return Array.from(this.activeSessions.values()).filter(
            (session) => session.userId === userId
        );
    }
}

const sessionManager = new SessionManager();

const configureSocket = async (fastify: FastifyInstance) => {
    // Get the HTTP server from Fastify
    const httpServer = fastify.server as HttpServer;

    // Create Socket.IO server
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });

    // Add Socket.IO instance to Fastify instance
    fastify.decorate("io", io);
    fastify.decorate("sessionManager", sessionManager);

    io.on("connection", (socket) => {
        const sessionId = socket.id;
        const userAgent = socket.handshake.headers["user-agent"];
        const ipAddress = socket.handshake.address;

        // Create new session
        const session: ActiveSession = {
            id: sessionId,
            connectedAt: new Date(),
            userAgent,
            ipAddress,
        };

        sessionManager.addSession(sessionId, session);

        fastify.log.info(
            `New connection: ${sessionId}. Active sessions: ${sessionManager.getActiveSessionsCount()}`
        );

        // Emit current active sessions count to all connected clients
        io.emit("activeSessionsCount", sessionManager.getActiveSessionsCount());

        // Handle user authentication
        socket.on("authenticate", (data: { userId: string; token: string }) => {
            // Here you could verify the JWT token if needed
            sessionManager.updateSession(sessionId, { userId: data.userId });

            fastify.log.info(
                `User ${data.userId} authenticated on session ${sessionId}`
            );

            // Emit updated session info
            io.emit(
                "activeSessionsCount",
                sessionManager.getActiveSessionsCount()
            );
        });

        // Handle getting active sessions count
        socket.on("getActiveSessionsCount", (callback) => {
            if (typeof callback === "function") {
                callback(sessionManager.getActiveSessionsCount());
            }
        });

        // Handle getting detailed session info (admin only)
        socket.on("getActiveSessions", (callback) => {
            if (typeof callback === "function") {
                callback(sessionManager.getAllActiveSessions());
            }
        });

        // Handle disconnect
        socket.on("disconnect", (reason) => {
            sessionManager.removeSession(sessionId);

            fastify.log.info(
                `Connection disconnected: ${sessionId}. Reason: ${reason}. Active sessions: ${sessionManager.getActiveSessionsCount()}`
            );

            // Emit updated active sessions count to all connected clients
            io.emit(
                "activeSessionsCount",
                sessionManager.getActiveSessionsCount()
            );
        });
    });

    // Add graceful shutdown
    fastify.addHook("onClose", async () => {
        io.close();
    });
};

export default fp(configureSocket, {
    name: "socket",
});

// Extend Fastify types
declare module "fastify" {
    interface FastifyInstance {
        io: SocketIOServer;
        sessionManager: SessionManager;
    }
}
