import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;

const defaultUserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

const registerUserBodySchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(
            MIN_PASSWORD_LENGTH,
            "Password must be at least 8 characters long"
        ),
    name: z.string().optional(),
});

type RegisterUserInput = z.infer<typeof registerUserBodySchema>;

const registerUserResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        user: defaultUserSchema,
        token: z.string(),
    }),
});

type RegisterUserResponse = z.infer<typeof registerUserResponseSchema>;

const loginUserBodySchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

type LoginUserInput = z.infer<typeof loginUserBodySchema>;

const loginUserResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        user: defaultUserSchema,
        token: z.string(),
    }),
});

type LoginUserResponse = z.infer<typeof loginUserResponseSchema>;

const getCurrentUserResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        user: defaultUserSchema,
    }),
});

type GetCurrentUserResponse = z.infer<typeof getCurrentUserResponseSchema>;

const getUserByIdResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        user: defaultUserSchema,
    }),
});

type GetUserByIdResponse = z.infer<typeof getUserByIdResponseSchema>;

const authHeadersSchema = z.object({
    authorization: z.string().describe("Bearer token"),
});

const userParamsSchema = z.object({
    userId: z.string().describe("User ID"),
});

export {
    registerUserBodySchema,
    registerUserResponseSchema,
    loginUserBodySchema,
    loginUserResponseSchema,
    getCurrentUserResponseSchema,
    getUserByIdResponseSchema,
    authHeadersSchema,
    userParamsSchema,
};

export type {
    RegisterUserInput,
    RegisterUserResponse,
    LoginUserInput,
    LoginUserResponse,
    GetCurrentUserResponse,
    GetUserByIdResponse,
};
