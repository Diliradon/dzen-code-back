import { AwilixContainer } from "awilix";
import { EnvConfig } from "./env.type.ts";
import { PrismaClient } from "@prisma/client";
import { Cradle } from "./di-container.type.ts";

declare module "fastify" {
    export interface FastifyInstance {
        config: EnvConfig;
        prisma: PrismaClient;
        di: AwilixContainer<Cradle>;
    }
}
