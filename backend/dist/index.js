"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const app_1 = __importDefault(require("./app"));
const port = env_1.env.PORT;
app_1.default.listen(port, () => {
    console.log(`🚀 API ready on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map