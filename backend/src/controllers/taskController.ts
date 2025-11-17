import type { Request, Response, NextFunction } from "express";
import { TaskStatus, type Prisma } from "../generated/prisma/client";

import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";
import { createTaskSchema, taskQuerySchema, updateTaskSchema } from "../schemas/taskSchemas";

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

const ensureOwner = async (taskId: string | undefined, userId: string) => {
  if (!taskId) {
    throw new HttpError(400, "Task id is required");
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) {
    throw new HttpError(404, "Task not found");
  }
  return task;
};

export const listTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, status, search } = taskQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;

    const where = {
      userId: req.user.id,
      ...(status ? { status } : {}),
      // SQLite does not support `mode: "insensitive"` here; `contains` uses LIKE,
      // which is case-insensitive for basic ASCII by default.
      ...(search ? { title: { contains: search } } : {}),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
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
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const payload = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        title: payload.title,
        description: payload.description ?? null,
        status: payload.status ?? TaskStatus.PENDING,
        userId: req.user.id,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const task = await ensureOwner(req.params.id, req.user.id);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await ensureOwner(req.params.id, req.user.id);
    const payload = updateTaskSchema.parse(req.body);
    const data: Prisma.TaskUpdateInput = {};

    if (payload.title !== undefined) {
      data.title = payload.title;
    }
    if (payload.description !== undefined) {
      data.description = payload.description ?? null;
    }
    if (payload.status !== undefined) {
      data.status = payload.status;
    }

    const task = await prisma.task.update({
      where: { id: existing.id },
      data,
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const task = await ensureOwner(req.params.id, req.user.id);
    await prisma.task.delete({ where: { id: task.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const toggleTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const task = await ensureOwner(req.params.id, req.user.id);
    const nextStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    const updated = await prisma.task.update({
      where: { id: task.id },
      data: { status: nextStatus },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

