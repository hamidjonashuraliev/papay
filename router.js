// This module is a definition of various routes using the Express Router.
const express = require("express");
const router = express.Router(); //  An instance of the Express router to define and manage routes.
const memberController = require("./controllers/memberController"); // This is an imported module that contains methods to handle the logic for member-related endpoints, such as signup, login, and logout.

/********************************
 *      React REST API          *
 * ******************************/

// member related routers
router.post("/signup", memberController.signup); // Handles the signup process. Calls the signup method (cb fn) from memberController.
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);

// other routers
router.get("/menu", (req, res) => {
    res.send("Welcome to Menu Page");
});

router.get("/community", (req, res) => {
    res.send("Welcome to Community Page");
});

module.exports = router;
