import type { Request, Response, NextFunction } from "express";

import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";
import { hashPassword, comparePassword } from "../utils/password";
import { generateTokens, rotateRefreshToken, revokeRefreshToken } from "../services/tokenService";
import { loginSchema, refreshSchema, registerSchema } from "../schemas/authSchemas";
import { updateProfileSchema, changePasswordSchema } from "../schemas/profileSchemas";

const buildUserResponse = (user: {
  id: string;
  email: string;
  name: string;
  country: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  bio: string | null;
  avatarUrl: string | null;
}) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  country: user.country,
  dateOfBirth: user.dateOfBirth,
  gender: user.gender,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new HttpError(409, "Email already registered");
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        password: passwordHash,
      },
    });

    const tokens = await generateTokens(user.id);

    res.status(201).json({
      user: buildUserResponse(user),
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isValid = await comparePassword(payload.password, user.password);

    if (!isValid) {
      throw new HttpError(401, "Invalid credentials");
    }

    const tokens = await generateTokens(user.id);

    res.json({
      user: buildUserResponse(user),
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokens = await rotateRefreshToken(refreshToken);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    await revokeRefreshToken(refreshToken);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    res.json(buildUserResponse(user));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: payload.name,
        country: payload.country ?? null,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null,
        gender: payload.gender ?? null,
        bio: payload.bio ?? null,
        avatarUrl: payload.avatarUrl ?? null,
      },
    });

    res.json(buildUserResponse(user));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const isValid = await comparePassword(payload.currentPassword, user.password);
    if (!isValid) {
      throw new HttpError(400, "Current password is incorrect");
    }

    const newHash = await hashPassword(payload.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

