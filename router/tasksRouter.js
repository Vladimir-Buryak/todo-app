import { Router } from "express";
import tasksController from "../controllers/tasksController.js"
const router = new Router();

router.get("/tasks",  tasksController.findTask)
router.post("/tasks", tasksController.createTask);
router.put("/tasks", tasksController.updateFlagTask);
router.delete("/tasks", tasksController.removeTask);

export default router;