import { z } from "zod";
import { TaskStatus } from "../generated/prisma/client";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z
    .nativeEnum(TaskStatus)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  search: z.string().optional(),
});

