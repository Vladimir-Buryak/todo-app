import ErrorService from "../service/ErrorService.js";

export default (err, req, res, next) => {
   if (err instanceof ErrorService) return res.status(err.status).json({ message: err.message });
   res.status(500).json({ message: "Сталась помилка на сервері" });
};
