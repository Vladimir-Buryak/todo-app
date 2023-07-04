"use strict"
import './modules/displayPassword.js';

document.addEventListener("DOMContentLoaded", () => {
   const form = document.getElementById("form");
   const input = document.querySelectorAll("input");
   const btn = document.querySelector(".auth__button");

   const errorText = {
      gmail: "Електронна пошта повинна містити адресу: xxx@gmail.com",
      password: "Пароль має складатися з однієї літери та однієї цифри та мати довжину не менше 8 символів",
      text: "Заповніть поле з великої літери українською мовою",
      passwordMismatch: "Будь ласка, переконайтеся, що введені паролі співпадають",
   };

   const toggleButton = (button, isEnabled) => {
      if (isEnabled) {
         button.disabled = true;
      } else {
         button.disabled = false;
      }
   };

   form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      let error = FormValidate(input);
      if (error === 0) {
         toggleButton(btn, true);
         axios.post("/account/signup", new FormData(form))
            .then(res => {
               toggleButton(btn, false);
               alert(res.data.message);
               window.location.href = "/login"
            }).catch(err => {
               toggleButton(btn, false);
               alert(err.response.data.message);
            })
      };
   });

   const validate = (elem, regex, text) => {
      const parent = elem.parentNode
      removeError(parent)
      if (!regex) {
         createError(parent, text)
         return 1;
      }
      return 0;
   };

   const removeError = (elem) => {
      elem.parentNode.querySelector(".paragraph-error")?.remove();
      elem.classList.remove("_error");
   };

   const createError = (elem, text) => {
      const errorLabel = document.createElement('p');
      errorLabel.innerHTML = text;
      errorLabel.classList = "paragraph-error";
      elem.classList.add("_error");
      elem.parentNode.append(errorLabel)
   };

   const FormValidate = input => {
      let errorCount = 0;
      let passwordValue = "";

      input.forEach(element => {
         switch (element.type) {
            case "text":
               const nameRegex = /^[А-ЩЬЮЯІЇЄҐґ][а-щьюяіїєґ']{1,15}$/u.test(element.value);
               errorCount += validate(element, nameRegex, errorText.text);
               break;
            case "email":
               const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(element.value);
               errorCount += validate(element, emailRegex, errorText.gmail);
               break;
            default:
               const passwordRegexs = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(element.value);
               let count = validate(element, passwordRegexs, errorText.password);
               errorCount += count;
               if (!count) {
                  passwordValue ||= element.value;
                  if (passwordValue !== element.value) {
                     createError(element.parentNode, errorText.passwordMismatch)
                     errorCount++;
                  }
               }
               break;
         }
      });
      return errorCount;
   };
});
