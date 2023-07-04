"use strict"
const btn = document.querySelectorAll(".auth__icon--visible");

if (btn) {
   btn.forEach((item) => {
      item.addEventListener("mousedown", () => showPassword(item));
      item.addEventListener("mouseup", () => hidePassword(item));
      item.addEventListener("touchstart", () => showPassword(item));
      item.addEventListener("touchend", () => hidePassword(item));
   });
};

const showPassword = (btn) => {
   let input = btn.previousElementSibling
   if (input) {
      btn.setAttribute("src", "image/pass-on.svg");
      input.setAttribute("type", "text");
      btn.addEventListener("mouseout", () => hidePassword(btn));
   }
};

const hidePassword = (btn) => {
   let input = btn.previousElementSibling
   if (input) {
      btn.setAttribute("src", "image/pass-off.svg");
      input.setAttribute("type", "password");
   }
};


