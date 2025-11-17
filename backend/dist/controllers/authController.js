"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const prisma_1 = require("../config/prisma");
const httpError_1 = require("../utils/httpError");
const password_1 = require("../utils/password");
const tokenService_1 = require("../services/tokenService");
const authSchemas_1 = require("../schemas/authSchemas");
const buildUserResponse = (user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
});
const register = async (req, res, next) => {
    try {
        const payload = authSchemas_1.registerSchema.parse(req.body);
        const existing = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
        if (existing) {
            throw new httpError_1.HttpError(409, "Email already registered");
        }
        const passwordHash = await (0, password_1.hashPassword)(payload.password);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: payload.email,
                name: payload.name,
                password: passwordHash,
            },
        });
        const tokens = await (0, tokenService_1.generateTokens)(user.id);
        res.status(201).json({
            user: buildUserResponse(user),
            ...tokens,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const payload = authSchemas_1.loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
        if (!user) {
            throw new httpError_1.HttpError(401, "Invalid credentials");
        }
        const isValid = await (0, password_1.comparePassword)(payload.password, user.password);
        if (!isValid) {
            throw new httpError_1.HttpError(401, "Invalid credentials");
        }
        const tokens = await (0, tokenService_1.generateTokens)(user.id);
        res.json({
            user: buildUserResponse(user),
            ...tokens,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = authSchemas_1.refreshSchema.parse(req.body);
        const tokens = await (0, tokenService_1.rotateRefreshToken)(refreshToken);
        res.json(tokens);
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = authSchemas_1.refreshSchema.parse(req.body);
        await (0, tokenService_1.revokeRefreshToken)(refreshToken);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map