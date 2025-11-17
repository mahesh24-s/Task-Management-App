"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const zod_1 = require("zod");
const httpError_1 = require("../utils/httpError");
const notFound = (_req, _res, next) => {
    next(new httpError_1.HttpError(404, "Route not found"));
};
exports.notFound = notFound;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            message: "Validation failed",
            errors: err.flatten(),
        });
        return;
    }
    if (err instanceof httpError_1.HttpError) {
        res.status(err.status).json({
            message: err.message,
            details: err.details,
        });
        return;
    }
    console.error(err);
    res.status(500).json({
        message: "Unexpected error",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map