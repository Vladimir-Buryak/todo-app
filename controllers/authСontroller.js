import AuthService from "../service/AuthService.js";
const handleRespons = (res, status, text) => res.status(status).json({ message: text });
const handleCookie = (res, refreshToken) => {
   res.cookie('refreshToken', refreshToken, {
      path: "/",
      maxAge: 1500000,
      httpOnly: true,
      secure: true,
      sameSite: true
   });
};

class authController {
   async signup(req, res, next) {
      const userData = req.body;
      try {
         await AuthService.signup(userData);
         handleRespons(res, 200, "Користувача успішно збережено!");
      } catch (err) {
         next(err);
      };
   }

   async login(req, res, next) {
      const { email, password } = req.body;
      try {
         const { userWithEmail, accessToken, refreshToken } = await AuthService.login(email, password);
         handleCookie(res, refreshToken);
         res.status(200).json({
            accessToken,
            user: {
               first_name: userWithEmail.first_name,
               last_name: userWithEmail.last_name,
               email: userWithEmail.email
            }
         });
      } catch (err) {
         next(err);
      };
   }

   async refreshToken(req, res, next) {
      const cookie = req.cookies
      try {
         const { accessToken, refreshToken } = await AuthService.refreshToken(cookie);
         handleCookie(res, refreshToken);
         res.status(200).json({ accessToken });
      } catch (err) {
         next(err);
      }
   }

   async logout(req, res, next) {
      const { refreshToken } = req.cookies;
      try {
         await AuthService.logout(refreshToken);
         res.status(200).clearCookie("refreshToken");
         handleRespons(res, 200, "Ви успішно вийшли з облікового запису");
      } catch (err) {
         res.status(200).clearCookie("refreshToken");
         handleCookie(res, 400, "Сталася невідома помилка");
         next(err);
      };
   }
};

export default new authController();

