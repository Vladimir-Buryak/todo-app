import User from "../modules/User.js";
import TokenService from "../service/TokenService.js";

export default async (req, res, next) => {
   const bearerToken = req.get("Authorization")?.split(" ")[1];
   // Якщо токен не наданий, повертаємо статус 401 "Unauthorized" (Неавторизовано)
   if (!bearerToken) return res.status(401).json({ message: "Токен не наданий" });
   try {
      const { userId, type } = TokenService.tokenValidation(bearerToken, process.env.JWT_ACCESS_SECRET);
      // Якщо тип токена невірний, повертаємо статус 400 "Bad Request" (Поганий запит)
      if (type !== "accessToken") return res.status(400).json({ message: "Невірний токен!" });
      // Якщо тип токена невірний, повертаємо статус 400 "Bad Request" (Поганий запит)
      const user = await User.findById(userId);
      // Якщо користувача не знайдено, повертаємо статус 401 "Unauthorized" (Неавторизовано)
      if (!user) return res.status(401).json({ message: "Неавторизовано" });
      // Якщо всі перевірки успішні, передаємо управління наступному обробнику
      next();
   } catch (err) {
      next(err); 
   };
};