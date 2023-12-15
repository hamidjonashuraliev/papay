// This module is a definition of various routes using the Express Router.
const express = require("express");
const router = express.Router(); //  An instance of the Express router to define and manage routes.
const memberController = require("./controllers/memberController"); // This is an imported module that contains methods to handle the logic for member-related endpoints, such as signup, login, and logout.
const productController = require("./controllers/productController"); //contains the logic for handling requests related products.
const restaurantController = require("./controllers/restaurantController");
const orderController = require("./controllers/orderController");
const followController = require("./controllers/followController");
const communityController = require("./controllers/communityController");
const uploader_community = require("./utils/upload-multer")("community");
const uploader_member = require("./utils/upload-multer")("members");

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
router.get(
    "/products/:id",
    memberController.retrieveAuthMember,
    productController.getChosenProduct
);
//Restaurant related routers
router.get(
    "/restaurants",
    memberController.retrieveAuthMember,
    restaurantController.getRestaurants
);

router.get(
    "/restaurant/:id",
    memberController.retrieveAuthMember,
    restaurantController.getChosenRestaurant
);

// order-Related Route
router.post(
    "/orders/create",
    memberController.retrieveAuthMember,
    orderController.createOrder
);
router.get(
    "/orders",
    memberController.retrieveAuthMember,
    orderController.getMyOrders
);
router.post(
    "/orders/edit",
    memberController.retrieveAuthMember,
    orderController.editChosenOrder
);
// Community related routers
router.post(
    "/commuinity/image",
    uploader_community.single("community_image"),
    communityController.imageInsertion
);
router.post(
    "/community/create",
    memberController.retrieveAuthMember,
    communityController.createArticle
);
router.get(
    "/community/articles",
    memberController.retrieveAuthMember,
    communityController.getMemberArticles
);

router.get(
    "/community/target",
    memberController.retrieveAuthMember,
    communityController.getArticles
);

router.get(
    "/community/single-article/:art_id",
    memberController.retrieveAuthMember,
    communityController.getChosenArticle
);

//Following related routers
router.post(
    "/follow/subscribe",
    memberController.retrieveAuthMember,
    followController.subscribe
);

router.post(
    "/follow/unsubscribe",
    memberController.retrieveAuthMember,
    followController.unsubscribe
);
router.get("/follow/followings", followController.getMemberFollowings);

module.exports = router;
