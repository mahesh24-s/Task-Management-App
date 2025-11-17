"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const prisma_1 = require("../config/prisma");
const httpError_1 = require("../utils/httpError");
const authenticate = async (req, _res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            throw new httpError_1.HttpError(401, "Authentication required");
        }
        const token = header.split(" ")[1];
        if (!token) {
            throw new httpError_1.HttpError(401, "Authentication required");
        }
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        const userId = payload.sub;
        if (!userId) {
            throw new httpError_1.HttpError(401, "Invalid token payload");
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new httpError_1.HttpError(401, "User not found");
        }
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new httpError_1.HttpError(401, "Access token expired"));
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new httpError_1.HttpError(401, "Invalid access token"));
            return;
        }
        next(error);
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authMiddleware.js.map