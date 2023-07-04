const href = window.location.href.split("/")[3]

if (localStorage.getItem("accessToken") !== null && (href === "login" || href === "signup")) {
   window.location.href = "/dashboard"
} else if (localStorage.getItem("accessToken") == null && !(href === "login" || href === "signup")) {
   window.location.href = "/login"
}