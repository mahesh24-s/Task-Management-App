"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotateRefreshToken = exports.revokeRefreshToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ms_1 = __importDefault(require("ms"));
const crypto_1 = require("crypto");
const env_1 = require("../config/env");
const prisma_1 = require("../config/prisma");
const httpError_1 = require("../utils/httpError");
const hashToken = (token) => (0, crypto_1.createHash)("sha256").update(token).digest("hex");
const computeExpiryDate = (duration) => {
    const durationMs = (0, ms_1.default)(duration);
    if (!durationMs) {
        throw new Error(`Invalid duration format: ${duration}`);
    }
    return new Date(Date.now() + durationMs);
};
const accessTokenExpiresIn = env_1.env.ACCESS_TOKEN_EXPIRES_IN;
const refreshTokenExpiresIn = env_1.env.REFRESH_TOKEN_EXPIRES_IN;
const signAccessToken = (userId) => jsonwebtoken_1.default.sign({ sub: userId, type: "access" }, env_1.env.JWT_ACCESS_SECRET, {
    expiresIn: accessTokenExpiresIn,
});
const signRefreshToken = (userId) => jsonwebtoken_1.default.sign({ sub: userId, type: "refresh" }, env_1.env.JWT_REFRESH_SECRET, {
    expiresIn: refreshTokenExpiresIn,
});
const generateTokens = async (userId) => {
    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);
    const expiresAt = computeExpiryDate(env_1.env.REFRESH_TOKEN_EXPIRES_IN);
    await prisma_1.prisma.refreshToken.create({
        data: {
            tokenHash: hashToken(refreshToken),
            userId,
            expiresAt,
        },
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const revokeRefreshToken = async (refreshToken) => {
    const hashed = hashToken(refreshToken);
    const record = await prisma_1.prisma.refreshToken.findUnique({
        where: { tokenHash: hashed },
    });
    if (!record) {
        return;
    }
    await prisma_1.prisma.refreshToken.update({
        where: { id: record.id },
        data: { revoked: true },
    });
};
exports.revokeRefreshToken = revokeRefreshToken;
const assertRefreshTokenValid = async (refreshToken) => {
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(refreshToken, env_1.env.JWT_REFRESH_SECRET);
    }
    catch {
        throw new httpError_1.HttpError(401, "Invalid refresh token");
    }
    const hashed = hashToken(refreshToken);
    const stored = await prisma_1.prisma.refreshToken.findUnique({
        where: { tokenHash: hashed },
    });
    if (!stored || stored.revoked) {
        throw new httpError_1.HttpError(401, "Refresh token revoked or not found");
    }
    if (stored.expiresAt.getTime() <= Date.now()) {
        await prisma_1.prisma.refreshToken.update({
            where: { id: stored.id },
            data: { revoked: true },
        });
        throw new httpError_1.HttpError(401, "Refresh token expired");
    }
    return { userId: payload.sub, record: stored };
};
const rotateRefreshToken = async (refreshToken) => {
    const { userId, record } = await assertRefreshTokenValid(refreshToken);
    await prisma_1.prisma.refreshToken.update({
        where: { id: record.id },
        data: { revoked: true },
    });
    return (0, exports.generateTokens)(userId);
};
exports.rotateRefreshToken = rotateRefreshToken;
//# sourceMappingURL=tokenService.js.map