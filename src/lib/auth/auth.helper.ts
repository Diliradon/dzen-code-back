import { FastifyRequest } from "fastify";
import { UnauthorizedError } from "@/lib/errors/errors.js";

export const extractTokenFromRequest = (request: FastifyRequest): string => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Authorization token required");
    }

    // eslint-disable-next-line no-magic-numbers
    return authHeader.substring(7); // Remove "Bearer " prefix
};

export const verifyTokenAndGetUser = (
    request: FastifyRequest
): { userId: string; email: string } => {
    const token = extractTokenFromRequest(request);

    try {
        const decoded = request.server.jwt.verify(token) as {
            userId: string;
            email: string;
        };

        return decoded;
    } catch (error) {
        throw new UnauthorizedError("Invalid or expired token " + error);
    }
};

export const verifyToken = (request: FastifyRequest): void => {
    const token = extractTokenFromRequest(request);

    try {
        request.server.jwt.verify(token);
    } catch (error) {
        throw new UnauthorizedError("Invalid or expired token " + error);
    }
};
