let count = 0;
let isRefreshing = false;

// Створення екземпляру Axios з базовим URL
const api = axios.create({
   baseURL: "/api",
});

// Інтерсептор запиту (request interceptor),додає заголовок "Authorization" до запиту 
api.interceptors.request.use(config => {
   config.headers["Authorization"] = localStorage.getItem("accessToken");
   return config;
});

api.interceptors.request.use(config => {
   if (count === 0) {
      count++;
      return config;
   }
});

// Інтерсептор відповіді (response interceptor), оновлює токен
api.interceptors.response.use(config => {
   count--;
   return config;
}, err => {
   const originalConfig = err.config;
   if (err.response.status === 401 && err.config && !originalConfig._isRetryRequest && !isRefreshing) {
      originalConfig._isRetryRequest = true;
      isRefreshing = true;
      count--;
      return axios.get("/account/refreshtoken", { withCredentials: true })
         .then(res => {
            localStorage.setItem("accessToken", res.data.accessToken);
            isRefreshing = false;
            return api.request(originalConfig);
         })
         .catch(() => {
            isRefreshing = false;
            localStorage.clear();
            window.location.href = "/login";
         });
   }
   return Promise.reject(err);
});


export default api;