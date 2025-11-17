"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
        Error.captureStackTrace?.(this, HttpError);
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=httpError.js.map