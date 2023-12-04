console.log("Web serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router.js");

// 1: KIrish code
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2: section  code

// 3: views code
app.set("views", "views");
app.set("view engine", "ejs");

// 4: Routing code
// app.use("/resto", router_bssr);
app.use("/", router);

module.exports = app;
