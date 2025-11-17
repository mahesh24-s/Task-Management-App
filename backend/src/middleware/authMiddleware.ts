import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new HttpError(401, "Authentication required");
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw new HttpError(401, "Authentication required");
    }
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    const userId = payload.sub as string | undefined;

    if (!userId) {
      throw new HttpError(401, "Invalid token payload");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpError(401, "User not found");
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new HttpError(401, "Access token expired"));
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(new HttpError(401, "Invalid access token"));
      return;
    }
    next(error);
  }
};

