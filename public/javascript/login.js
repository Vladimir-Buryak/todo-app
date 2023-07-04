"use strict"
import './modules/displayPassword.js';

document.addEventListener("DOMContentLoaded", () => {
   const form = document.getElementById("form");
   const btn = document.querySelector(".auth__button");

   form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const toggleButton = (button, isEnabled) => {
         if (isEnabled) {
            button.disabled = true;
         } else {
            button.disabled = false;
         }
      };
      toggleButton(btn, true);

      axios.post("/account/login", new FormData(form))
         .then(res => {
            toggleButton(btn, false);
            const { accessToken, user } = res.data;
            alert("Вхід успішно виконано");
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("users", JSON.stringify(user));
            window.location.href = "/dashboard";
         }).catch(err => {
            toggleButton(btn, false)
            alert(err.response.data.message)
         });
   });
});
