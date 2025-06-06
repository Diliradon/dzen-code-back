import { FastifyBaseLogger } from "fastify";
import { hashing } from "@/lib/hashing/hashing.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { ConflictError, UnauthorizedError } from "@/lib/errors/errors.js";
import { UserRepository } from "@/database/repositories/user/user.repository.js";
import {
    RegisterUserInput,
    RegisterUserResponse,
    LoginUserInput,
    LoginUserResponse,
    GetCurrentUserResponse,
    GetUserByIdResponse,
} from "@/lib/validation/user/user.schema.js";

interface JWTService {
    sign: (
        payload: { userId: string; email: string },
        options?: { expiresIn: string }
    ) => string;
    verify: (token: string) => { userId: string; email: string };
}

export type UserService = {
    registerUser: (p: {
        payload: RegisterUserInput;
    }) => Promise<RegisterUserResponse>;
    loginUser: (p: { payload: LoginUserInput }) => Promise<LoginUserResponse>;
    getCurrentUser: (p: { userId: string }) => Promise<GetCurrentUserResponse>;
    getUserById: (p: { userId: string }) => Promise<GetUserByIdResponse>;
};

export const createService = (
    userRepository: UserRepository,
    log: FastifyBaseLogger,
    // config: EnvConfig,
    jwt: JWTService // Fastify JWT instance
): UserService => ({
    registerUser: async ({ payload }) => {
        const { email, password, name } = payload;

        // Check if user already exists
        const existingUser = await userRepository.findByEmail(email);

        if (existingUser) {
            throw new ConflictError("User with this email already exists.");
        }

        // Hash password
        const hashedPassword = await hashing.hashPassword(password);

        // Create user
        const user = await userRepository.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            { expiresIn: "7d" }
        );

        log.info("User registered successfully: %s", email);

        return {
            message: "User registered successfully.",
            data: {
                user,
                token,
            },
        };
    },

    loginUser: async ({ payload }) => {
        const { email, password } = payload;

        // Find user by email
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedError("Invalid email or password.");
        }

        // Verify password
        const isPasswordValid = await hashing.comparePassword(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid email or password.");
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            { expiresIn: "7d" }
        );

        log.info("User logged in successfully: %s", email);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;

        return {
            message: "User logged in successfully.",
            data: {
                user: userWithoutPassword,
                token,
            },
        };
    },

    getCurrentUser: async ({ userId }) => {
        const user = await userRepository.findUniqueOrFail({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        log.info("User retrieved successfully: %s", user.email);

        return {
            message: "User retrieved successfully.",
            data: {
                user,
            },
        };
    },

    getUserById: async ({ userId }) => {
        const user = await userRepository.findUniqueOrFail({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        log.info("User retrieved by ID: %s", user.email);

        return {
            message: "User retrieved successfully.",
            data: {
                user,
            },
        };
    },
});

addDIResolverName(createService, "userService");
