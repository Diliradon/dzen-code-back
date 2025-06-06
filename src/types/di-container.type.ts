import { EnvConfig } from "./env.type.js";
import { FastifyBaseLogger } from "fastify";
import { PrismaClient } from "@prisma/client/extension";
import { UserHandler } from "@/modules/user/user.handler.js";
import { UserService } from "@/modules/user/user.service.js";
import { MessageService } from "@/modules/message/message.service.js";
import { MessageHandler } from "@/modules/message/message.handler.js";
import { UserRepository } from "@/database/repositories/user/user.repository.js";
import { MessageRepository } from "@/database/repositories/message/message.repository.js";

export type Cradle = {
    log: FastifyBaseLogger;
    prisma: PrismaClient;
    config: EnvConfig;
    jwt: {
        sign: (
            payload: { userId: string; email: string },
            options?: { expiresIn: string }
        ) => string;
        verify: (token: string) => { userId: string; email: string };
    };

    messageRepository: MessageRepository;
    messageService: MessageService;
    messageHandler: MessageHandler;

    userRepository: UserRepository;
    userService: UserService;
    userHandler: UserHandler;
};
