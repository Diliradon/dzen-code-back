import { FastifyInstance } from "fastify";
import { UserHandler } from "./user.handler.js";
import {
    registerUserBodySchema,
    registerUserResponseSchema,
    loginUserBodySchema,
    loginUserResponseSchema,
    getCurrentUserResponseSchema,
    getUserByIdResponseSchema,
} from "@/lib/validation/user/user.schema.js";

export const createUserRoutes = (
    fastify: FastifyInstance,
    userHandler: UserHandler
) => {
    fastify.post(
        "/register",
        {
            schema: {
                tags: ["auth"],
                summary: "Register a new user",
                body: registerUserBodySchema,
                response: {
                    201: registerUserResponseSchema,
                    409: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        userHandler.registerUser
    );

    fastify.post(
        "/login",
        {
            schema: {
                tags: ["auth"],
                summary: "Login user",
                body: loginUserBodySchema,
                response: {
                    200: loginUserResponseSchema,
                    401: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        userHandler.loginUser
    );

    fastify.get(
        "/me",
        {
            schema: {
                tags: ["user"],
                summary: "Get current user profile",
                headers: {
                    type: "object",
                    properties: {
                        authorization: {
                            type: "string",
                            description: "Bearer token",
                        },
                    },
                    required: ["authorization"],
                },
                response: {
                    200: getCurrentUserResponseSchema,
                    401: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        userHandler.getCurrentUser
    );

    fastify.get(
        "/:userId",
        {
            schema: {
                tags: ["user"],
                summary: "Get user by ID",
                headers: {
                    type: "object",
                    properties: {
                        authorization: {
                            type: "string",
                            description: "Bearer token",
                        },
                    },
                    required: ["authorization"],
                },
                params: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            description: "User ID",
                        },
                    },
                    required: ["userId"],
                },
                response: {
                    200: getUserByIdResponseSchema,
                    401: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" },
                        },
                    },
                    404: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        userHandler.getUserById
    );
};
