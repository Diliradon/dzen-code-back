import { UserService } from "./user.service.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { verifyTokenAndGetUser, verifyToken } from "@/lib/auth/auth.helper.js";
import {
    RegisterUserInput,
    LoginUserInput,
} from "@/lib/validation/user/user.schema.js";

export type UserHandler = {
    registerUser: (
        request: FastifyRequest<{
            Body: RegisterUserInput;
        }>,
        reply: FastifyReply
    ) => Promise<void>;

    loginUser: (
        request: FastifyRequest<{
            Body: LoginUserInput;
        }>,
        reply: FastifyReply
    ) => Promise<void>;

    getCurrentUser: (
        request: FastifyRequest,
        reply: FastifyReply
    ) => Promise<void>;

    getUserById: (
        request: FastifyRequest<{
            Params: { userId: string };
        }>,
        reply: FastifyReply
    ) => Promise<void>;
};

export const createHandler = (userService: UserService): UserHandler => {
    return {
        registerUser: async (request, reply) => {
            const { body } = request;

            const data = await userService.registerUser({
                payload: body,
            });

            return reply.status(201).send(data);
        },

        loginUser: async (request, reply) => {
            const { body } = request;

            const data = await userService.loginUser({
                payload: body,
            });

            return reply.send(data);
        },

        getCurrentUser: async (request, reply) => {
            const decoded = verifyTokenAndGetUser(request);

            const data = await userService.getCurrentUser({
                userId: decoded.userId,
            });

            return reply.send(data);
        },

        getUserById: async (request, reply) => {
            verifyToken(request);

            const { userId } = request.params;

            const data = await userService.getUserById({
                userId,
            });

            return reply.send(data);
        },
    };
};

addDIResolverName(createHandler, "userHandler");
