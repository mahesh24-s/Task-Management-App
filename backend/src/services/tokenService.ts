import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import ms from "ms";
import { createHash } from "crypto";

import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

const computeExpiryDate = (duration: string) => {
  const durationMs = ms(duration as Parameters<typeof ms>[0]);
  if (!durationMs) {
    throw new Error(`Invalid duration format: ${duration}`);
  }
  return new Date(Date.now() + durationMs);
};

type ExpiresIn = NonNullable<SignOptions["expiresIn"]>;
const accessTokenExpiresIn = env.ACCESS_TOKEN_EXPIRES_IN as ExpiresIn;
const refreshTokenExpiresIn = env.REFRESH_TOKEN_EXPIRES_IN as ExpiresIn;

const signAccessToken = (userId: string) =>
  jwt.sign({ sub: userId, type: "access" }, env.JWT_ACCESS_SECRET, {
    expiresIn: accessTokenExpiresIn,
  });

const signRefreshToken = (userId: string) =>
  jwt.sign({ sub: userId, type: "refresh" }, env.JWT_REFRESH_SECRET, {
    expiresIn: refreshTokenExpiresIn,
  });

export const generateTokens = async (userId: string) => {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);
  const expiresAt = computeExpiryDate(env.REFRESH_TOKEN_EXPIRES_IN);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

export const revokeRefreshToken = async (refreshToken: string) => {
  const hashed = hashToken(refreshToken);
  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashed },
  });

  if (!record) {
    return;
  }

  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revoked: true },
  });
};

const assertRefreshTokenValid = async (refreshToken: string) => {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new HttpError(401, "Invalid refresh token");
  }

  const hashed = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashed },
  });

  if (!stored || stored.revoked) {
    throw new HttpError(401, "Refresh token revoked or not found");
  }

  if (stored.expiresAt.getTime() <= Date.now()) {
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });
    throw new HttpError(401, "Refresh token expired");
  }

  return { userId: payload.sub as string, record: stored };
};

export const rotateRefreshToken = async (refreshToken: string) => {
  const { userId, record } = await assertRefreshTokenValid(refreshToken);

  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revoked: true },
  });

  return generateTokens(userId);
};

