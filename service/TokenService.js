import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import Token from "../modules/Token.js";
import ErrorService from "./ErrorService.js";

class TokenService {
   // Функція для генерації токена на основі ідентифікатора користувача
   generateToken(userId) {
      const tokenId = uuidv4();
      const accessToken = `Bearer: ${jwt.sign({ userId, type: "accessToken" }, process.env.JWT_ACCESS_SECRET, { expiresIn: "10m" })}`;
      const refreshToken = jwt.sign({ tokenId, type: "refreshToken" }, process.env.JWT_REFRESH_SECRET, { expiresIn: "25m" });
      return { accessToken, refreshToken, tokenId };
   };
   
   // Функція для оновлення access і refresh токенів
   async updateTokens(userId) {
      const { accessToken, refreshToken, tokenId } = this.generateToken(userId);
      await Token.findOneAndRemove({ userId });
      await Token.create({ userId, tokenId });
      return ({ accessToken, refreshToken });
   };
   // Функція для перевірки access і refresh токенів
   tokenValidation(token, secretKey) {
      try {
         const payload = jwt.verify(token, secretKey);
         return payload;
      } catch (err) {      
         if (err instanceof jwt.TokenExpiredError) {
            throw ErrorService.Unauthorized("Токен закінчився");
         } else if (err instanceof jwt.JsonWebTokenError) {
            throw ErrorService.Unauthorized("Токен Невалідний");
         }
      };
   };
};

export default new TokenService();



