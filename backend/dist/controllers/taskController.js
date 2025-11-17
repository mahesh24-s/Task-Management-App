"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTask = exports.deleteTask = exports.updateTask = exports.getTask = exports.createTask = exports.listTasks = void 0;
const client_1 = require("../generated/prisma/client");
const prisma_1 = require("../config/prisma");
const httpError_1 = require("../utils/httpError");
const taskSchemas_1 = require("../schemas/taskSchemas");
const ensureOwner = async (taskId, userId) => {
    if (!taskId) {
        throw new httpError_1.HttpError(400, "Task id is required");
    }
    const task = await prisma_1.prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.userId !== userId) {
        throw new httpError_1.HttpError(404, "Task not found");
    }
    return task;
};
const listTasks = async (req, res, next) => {
    try {
        const { page, limit, status, search } = taskSchemas_1.taskQuerySchema.parse(req.query);
        const skip = (page - 1) * limit;
        const where = {
            userId: req.user.id,
            ...(status ? { status } : {}),
            ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
        };
        const [tasks, total] = await Promise.all([
            prisma_1.prisma.task.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma_1.prisma.task.count({ where }),
        ]);
        res.json({
            data: tasks,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.listTasks = listTasks;
const createTask = async (req, res, next) => {
    try {
        const payload = taskSchemas_1.createTaskSchema.parse(req.body);
        const task = await prisma_1.prisma.task.create({
            data: {
                title: payload.title,
                description: payload.description ?? null,
                status: payload.status ?? client_1.TaskStatus.PENDING,
                userId: req.user.id,
            },
        });
        res.status(201).json(task);
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const getTask = async (req, res, next) => {
    try {
        const task = await ensureOwner(req.params.id, req.user.id);
        res.json(task);
    }
    catch (error) {
        next(error);
    }
};
exports.getTask = getTask;
const updateTask = async (req, res, next) => {
    try {
        const existing = await ensureOwner(req.params.id, req.user.id);
        const payload = taskSchemas_1.updateTaskSchema.parse(req.body);
        const data = {};
        if (payload.title !== undefined) {
            data.title = payload.title;
        }
        if (payload.description !== undefined) {
            data.description = payload.description ?? null;
        }
        if (payload.status !== undefined) {
            data.status = payload.status;
        }
        const task = await prisma_1.prisma.task.update({
            where: { id: existing.id },
            data,
        });
        res.json(task);
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        const task = await ensureOwner(req.params.id, req.user.id);
        await prisma_1.prisma.task.delete({ where: { id: task.id } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
const toggleTask = async (req, res, next) => {
    try {
        const task = await ensureOwner(req.params.id, req.user.id);
        const nextStatus = task.status === client_1.TaskStatus.COMPLETED ? client_1.TaskStatus.PENDING : client_1.TaskStatus.COMPLETED;
        const updated = await prisma_1.prisma.task.update({
            where: { id: task.id },
            data: { status: nextStatus },
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
};
exports.toggleTask = toggleTask;
//# sourceMappingURL=taskController.js.map