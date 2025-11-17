"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
router.get("/", taskController_1.listTasks);
router.post("/", taskController_1.createTask);
router.get("/:id", taskController_1.getTask);
router.patch("/:id", taskController_1.updateTask);
router.delete("/:id", taskController_1.deleteTask);
router.post("/:id/toggle", taskController_1.toggleTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map