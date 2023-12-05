// This module is a definition of various routes using the Express Router.
const express = require("express");
const router = express.Router(); //  An instance of the Express router to define and manage routes.
const memberController = require("./controllers/memberController"); // This is an imported module that contains methods to handle the logic for member-related endpoints, such as signup, login, and logout.
const productController = require("./controllers/productController"); //contains the logic for handling requests related products.

/********************************
 *      React REST API          *
 * ******************************/

// Member-Related Routes
router.post("/signup", memberController.signup); // Handles the signup process. Calls the signup method (cb fn) from memberController.
router.post("/login", memberController.login); //route is set up to handle login requests using the login method in memberController.
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication); //is used to verify if a user is authenticated.
router.get(
    "/member/:id",
    memberController.retrieveAuthMember,
    memberController.getChosenMember
);

// Product-Related Routes
router.post(
    // Get All Products: The route POST /products is set up to retrieve all products. It first ensures the user is authenticated using retrieveAuthMember from memberController and then calls getAllProducts from productController.
    "/products",
    memberController.retrieveAuthMember,
    productController.getAllProducts
);

module.exports = router;
