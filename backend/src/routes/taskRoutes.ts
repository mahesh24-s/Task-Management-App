import { Router } from "express";
import { createTask, deleteTask, getTask, listTasks, toggleTask, updateTask } from "../controllers/taskController";

const router = Router();

router.get("/", listTasks);
router.post("/", createTask);
router.get("/:id", getTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/toggle", toggleTask);

export default router;

