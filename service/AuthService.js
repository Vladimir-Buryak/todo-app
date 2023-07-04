import Task from "../modules/Task.js";
import Users from "../modules/User.js";
import Token from "../modules/Token.js";
import bcrypt from "bcrypt";
import TokenService from "./TokenService.js";
import ErrorService from "./ErrorService.js";

class AuthService {
   async signup(userData) {
      const { first_name, last_name, email, password } = userData;
      // Перевіряємо, чи вже існує користувач з такою ж електронною адресою
      const userWithEmail = await Users.findOne({ email });
      if (userWithEmail) throw ErrorService.BadRequest("Користувач із цією електронною адресою вже зареєстрований!");
      // Хешуємо пароль для збереження в базі даних
      const hashPassword = bcrypt.hashSync(password, 10);
      // Створюємо нового користувача з отриманими даними
      const user = await Users({ first_name, last_name, email, password: hashPassword });
      const { _id } = await user.save();
      // Створюємо пустий список задач для цього користувача
      Task.create({ userId: _id, task: [] });
   }

   async login(email, password) {
      // Знаходить користувача за вказаним електронним листом
      const userWithEmail = await Users.findOne({ email });
      if (!userWithEmail) throw ErrorService.BadRequest("Невірний email або користувач не існує!");
      // Перевіряє введений пароль на відповідність збереженому паролю користувача.
      const checkPassword = bcrypt.compareSync(password, userWithEmail.password);
      if (!checkPassword) throw ErrorService.BadRequest("Невірний пароль!");
      // Повертає об'єкт, що містить дані користувача з електронною поштою та оновлені токени.
      const token = await TokenService.updateTokens(userWithEmail._id);
      return { userWithEmail, ...token };
   }

   async refreshToken(cookie) {
      const { refreshToken } = cookie;
      // Перевірка, чи надано токен
      if (!refreshToken) throw ErrorService.Unauthorized("Не надано refresh токен!");
      // Перевірка валідності токену та отримання ідентифікатора та типу токену
      const { tokenId, type } = TokenService.tokenValidation(refreshToken, process.env.JWT_REFRESH_SECRET);
      // Перевірка, чи тип токену є "refreshToken"
      if (type !== "refreshToken") throw ErrorService.Unauthorized("Невірний токен!");
      // Отримання ідентифікатора користувача на основі tokenId
      const tokenInfo = await Token.findOne({ tokenId });
      // Перевірка, чи існує користувач з таким ідентифікатором та оновлення токенів для користувача і повернення результату
      if (tokenInfo === null) throw ErrorService.Unauthorized("Невірний токен!");
      return await TokenService.updateTokens(tokenInfo.userId);
   }

   async logout(refreshToken) {
      // Перевірка, чи надано токен
      if (!refreshToken) throw ErrorService.Unauthorized("Не надано токен!");
      const { tokenId } = TokenService.tokenValidation(refreshToken, process.env.JWT_REFRESH_SECRET);
      // Знаходження і видалення токену з бази даних
      await Token.findOneAndRemove({ tokenId });
   }
};

export default new AuthService();