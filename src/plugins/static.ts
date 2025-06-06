import path from "path";
import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FastifyInstance } from "fastify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configureStatic = async (fastify: FastifyInstance) => {
    await fastify.register(fastifyStatic, {
        root: path.join(__dirname, "../../public"),
        prefix: "/", // optional: default '/'
    });
};

export default fp(configureStatic, {
    name: "static",
});
