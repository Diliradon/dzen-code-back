import { z } from "zod";

const activeSessionSchema = z.object({
    id: z.string(),
    userId: z.string().optional(),
    connectedAt: z.date(),
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
});

const getActiveSessionsCountResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        activeSessionsCount: z.number(),
        timestamp: z.string(),
    }),
});

type GetActiveSessionsCountResponse = z.infer<
    typeof getActiveSessionsCountResponseSchema
>;

const getActiveSessionsResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        sessions: z.array(activeSessionSchema),
        totalCount: z.number(),
        timestamp: z.string(),
    }),
});

type GetActiveSessionsResponse = z.infer<
    typeof getActiveSessionsResponseSchema
>;

export {
    getActiveSessionsCountResponseSchema,
    getActiveSessionsResponseSchema,
};

export type { GetActiveSessionsCountResponse, GetActiveSessionsResponse };
