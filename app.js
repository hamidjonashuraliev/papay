console.log("Web serverni boshlash");
const express = require("express");
const app = express();

const db = require("./server").db();
const mongodb = require("mongodb");

// 1: KIrish code
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2: section  code

// 3: views code
app.set("views", "views");
app.set("view engine", "ejs");

// 4: Routing code

module.exports = app;
