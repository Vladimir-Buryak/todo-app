export default class ErrorService extends Error {
   constructor(status, message) {
      super(message);
      this.status = status;
   };

   static Unauthorized(message) {
      return new ErrorService(401, message || "Користувач не авторизований");
   }

   static BadRequest(message) {
      return new ErrorService(400, message);
   }

   static Forbidden(message) {
      return new ErrorService(403, message);
   }
};

