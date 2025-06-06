import { UserService } from "./user.service.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
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
    };
};

addDIResolverName(createHandler, "userHandler");
