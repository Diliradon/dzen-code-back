import { Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "@/lib/errors/errors.js";
import { addDIResolverName } from "@/lib/awilix/awilix.js";
import { FindUniqueOrFail } from "@/database/prisma/prisma.type.js";
import { BaseRepository, generateRepository } from "../generate.repository.js";

export type UserRepository = BaseRepository<"user"> & {
    findUniqueOrFail: FindUniqueOrFail<
        Prisma.UserFindUniqueArgs,
        Prisma.$UserPayload
    >;
    findByEmail: (
        email: string
    ) => Promise<Prisma.$UserPayload["scalars"] | null>;
};

export const createUserRepository = (prisma: PrismaClient): UserRepository => {
    const repository = generateRepository(prisma, "User");

    return {
        ...repository,
        findUniqueOrFail: async (args) => {
            const user = await prisma.user.findUnique(args);

            if (!user) {
                throw new NotFoundError("User not found.");
            }

            return user;
        },
        findByEmail: async (email: string) => {
            return prisma.user.findUnique({
                where: { email },
            });
        },
    };
};

addDIResolverName(createUserRepository, "userRepository");
