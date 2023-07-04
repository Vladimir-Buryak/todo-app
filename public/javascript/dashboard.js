"use strict"
import api from "./modules/http/apiManagement.js";

const dom = {
   addTask: document.querySelector(".add-task__button"),
   btnLogout: document.querySelector(".user__logout"),
   input: document.querySelector("input"),
   taskList: document.querySelector(".task-list__row")
}



const { email, first_name, last_name } = JSON.parse(localStorage.getItem("users"));
document.querySelector(".user__gmail h2").textContent = email;
document.querySelector(".user__name h2").textContent = `${first_name} ${last_name}`;

// Функція обробки помилок
const errorHandler = (err) => {
   if (err instanceof TypeError) return;
   alert(err.response.data.message);
};

// Функція рендеру HTML-кода
const renderHtmlTask = (list, data) => {
   let status = data.status ? "enabled" : "";
   list.insertAdjacentHTML("afterbegin", `<div class="task-list__item ${status}" id = "${data.taskId}">
   <button class="task-list__button-status"><svg width="31" height="30" viewBox="0 0 25 19" fill="none"
         xmlns="http://www.w3.org/2000/svg">
         <path d="M23 2L8.5625 17L2 10.1818" stroke-width="3" stroke-linecap="round"
            stroke-linejoin="round" />
      </svg></button>
   <div class="task-list__text">
      <p>${data.text.trim()}</p>
   </div>
   <button class="task-list__button-delete"> <img src="image/trash.svg" alt="trash"></button>
   </div>`);
};

// Функція рендеру завдань під час оновлення сторінки
document.addEventListener("DOMContentLoaded", () => {
   api.get("/tasks")
      .then(res => {
         if (res.data.task.length === 0) return alert(res.data.task.message);
         const arrTask = res.data.task;
         arrTask.forEach(data => {
            renderHtmlTask(dom.taskList, data);
         });
      })
      .catch(err => errorHandler(err));
});

// Функція створення завдань
dom.addTask.addEventListener("click", () => {
   if (!dom.input.value.trim()) {
      alert("Спочатку потрібно створити завдання");
      return;
   } else if (dom.input.value.split(" ").length >= 40) {
      alert("Ви перевищили кількість слів");
      return;
   }

   api.post("/tasks", {
      taskId: Math.floor(Math.random() * 10000000),
      text: dom.input.value,
      status: false
   })
      .then(res => {
         if (res.data.length) return alert(res.data.message);
         renderHtmlTask(dom.taskList, res.data);
      })
      .catch(err => errorHandler(err))
      .finally(() => {
         dom.input.value = "";
         window.scrollTo(0, 0);
      });
});

// Функція для обробки кнопок
dom.taskList.addEventListener("click", element => {
   const deleteButton = element.target.closest(".task-list__button-delete")?.parentNode,
      statusButton = element.target.closest(".task-list__button-status")?.parentNode;

   if (deleteButton) {
      api.delete("/tasks", { data: { taskId: deleteButton.getAttribute("id") } })
         .then(() => deleteButton.remove())
         .catch(err => {
            errorHandler(err);
         });
   } else if (statusButton) {
      api.put("/tasks", {
         taskId: statusButton.getAttribute("id"),
         status: !statusButton.classList.contains("enabled")
      })
         .then(() => statusButton.classList.toggle("enabled"))
         .catch(err => errorHandler(err));
   };
});


// Функція виходу з облікового запису
const logout = () => {
   axios.get("/account/logout")
      .then(res => alert(res.data.message))
      .finally(() => {
         localStorage.clear();
         location.href = "/login";
      })
}

dom.btnLogout.addEventListener("click", logout);










