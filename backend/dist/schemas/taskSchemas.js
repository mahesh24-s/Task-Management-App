"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskQuerySchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../generated/prisma/client");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(1000).optional(),
    status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
});
exports.updateTaskSchema = exports.createTaskSchema.partial();
exports.taskQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(10),
    status: zod_1.z
        .nativeEnum(client_1.TaskStatus)
        .optional()
        .or(zod_1.z.literal("").transform(() => undefined)),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=taskSchemas.js.map