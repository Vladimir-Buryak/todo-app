import Task from "../modules/Task.js";
import ErrorService from "./ErrorService.js";
import TokenService from "./TokenService.js";

class TaskService {
   async findTask(bearerToken) {
      // Перевірка наявності ідентифікатора
      if (!bearerToken) throw ErrorService.Unauthorized("Ідентифікатор не надано");
      // Перевірка та отримання ідентифікатора користувача з токену
      const { userId } = TokenService.tokenValidation(bearerToken, process.env.JWT_ACCESS_SECRET);
      // Перевірка наявності завдань
      const { task } = await Task.findOne({ userId });
      if (!task.length) {
         return {
            message: "Завдань немає",
            length: task.length
         };
      };
      // Повернення знайдених завдань
      return task;
   }

   async createTask(taskData) {
      const { bearerToken, taskId, text, status } = taskData;
      // Перевірка наявності ідентифікатора
      if (!bearerToken) throw ErrorService.Unauthorized("Ідентифікатор не надано");
      // Перевірка та отримання ідентифікатора користувача з токену
      const { userId } = TokenService.tokenValidation(bearerToken, process.env.JWT_ACCESS_SECRET);
      // Шукаємо задачу за userId і текстом
      const { task } = await Task.findOne({ userId }, { task: { $elemMatch: { text: text.toLowerCase() } } });
      if (task.length) {
         return {
            message: "Завданя вже  існує",
            length: task.length
         };
      };
      const { matchedCount } = await Task.updateOne({ userId }, { $push: { task: { taskId, text: text.toLowerCase(), status } } });
      // Якщо кількість співпадінь matchedCount дорівнює 0, виникає помилка
      if (!matchedCount) throw ErrorService.BadRequest("При додаванні сталась помилка");
      // Повертаємо дані про створену задачу
      return { taskId, text, status };
   }

   async updateFlagTask(bearerToken, taskId, status) {
      // Перевірка наявності ідентифікатора
      if (!bearerToken) throw ErrorService.Unauthorized("Ідентифікатор не надано");
      // Перевірка та отримання ідентифікатора користувача з токену
      const { userId } = TokenService.tokenValidation(bearerToken, process.env.JWT_ACCESS_SECRET);
      // Оновлює статус виконання завдання
      const { modifiedCount } = await Task.updateOne({ userId, task: { $elemMatch: { taskId: +taskId } } }, { $set: { "task.$.status": status } });
      // Перевірка, чи відбулось оновлення
      if (!modifiedCount) throw ErrorService.BadRequest("При оновленні сталась помилка");
   }

   async removeTask(taskId, bearerToken) {
      // Перевірка наявності ідентифікатора
      if (!bearerToken) throw ErrorService.Unauthorized("Ідентифікатор не надано");
      // Перевірка та отримання ідентифікатора користувача з токену
      const { userId } = TokenService.tokenValidation(bearerToken, process.env.JWT_ACCESS_SECRET);
      // Видалення завдання за ідентифікатором
      const { modifiedCount } = await Task.updateOne({ userId }, { $pull: { task: { taskId: +taskId } } });
      if (!modifiedCount) throw ErrorService.BadRequest("При видаленні сталась помилка");
   }
};

export default new TaskService();