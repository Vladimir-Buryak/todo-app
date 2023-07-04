import { Router } from "express";
const router = new Router();

router.get("/", (req, res) => res.redirect("/login"));
router.get("/signup", (req, res) => res.render("signup", { title: "signup" }));
router.get("/login", (req, res) => res.render("login", { title: "login" }));
router.get("/dashboard", (req, res) => res.render("dashboard", { title: "dashboard" }));

export default router;

