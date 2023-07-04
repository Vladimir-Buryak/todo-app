import TaskService from "../service/taskService.js";

class tasksController {
   async findTask(req, res, next) {
      const bearerToken = req.get("Authorization")?.split(" ")[1];
      try {
         const task = await TaskService.findTask(bearerToken);
         res.status(200).json({ task });
      } catch (err) {
         next(err);
      };
   }

   async createTask(req, res, next) {
      const bearerToken = req.get("Authorization")?.split(" ")[1];
      const task = req.body;
      try {
         const data = await TaskService.createTask({ bearerToken, ...task });
         res.status(200).json({ ...data });
      } catch (err) {
         next(err);
      }
   }

   async updateFlagTask(req, res, next) {
      const bearerToken = req.get("Authorization")?.split(" ")[1];
      const { taskId, status } = req.body;
      try {
         await TaskService.updateFlagTask(bearerToken, taskId, status);
         res.status(200).json({ message: "Успішно" });
      } catch (err) {
         next(err);
      };
   }

   async removeTask(req, res, next) {
      const bearerToken = req.get("Authorization")?.split(" ")[1];
      const { taskId } = req.body;
      try {
         await TaskService.removeTask(taskId, bearerToken);
         res.status(200).json({ message: "Успішно" });
      } catch (err) {
         next(err);
      };
   }
}




export default new tasksController()
