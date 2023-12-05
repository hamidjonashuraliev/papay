// This controller handles various functionalities related to restaurant management and authentication.
let restaurantController = module.exports;
const Member = require("../models/Member");
const Product = require("../models/Product");

restaurantController.home = async (req, res) => {
    try {
        console.log("GET: controller/home");
        res.render("home-page");
    } catch (err) {
        console.log(`ERROR, cont/home, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

restaurantController.getMyRestaurantProducts = async (req, res) => {
    try {
        console.log("GET: controller/getMyRestaurantProducts");
        // TODO: Get my restaurant products
        const product = new Product();
        const data = await product.getAllProductsDataResto(res.locals.member);
        res.render("restaurant-menu", { restaurant_data: data }); //  It renders (koʻrsatuvchi) a view called "restaurant-menu".
    } catch (error) {
        console.log(
            `Error, controller/getMyRestaurantProducts, ${error.message}`
        );
        res.json({ state: "fail", message: error.message });
    }
};

restaurantController.getSignupMyRestaurant = async (req, res) => {
    try {
        console.log("GET: controller/getSignupMyRestaurant");
        res.render("signup"); // An async function that simply renders a signup page for restaurants.
    } catch (error) {
        console.log(`Error, controller/signup, ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

restaurantController.signupProcess = async (req, res) => {
    // After successful signup, the new member (restaurant) details are stored in the session and the user is redirected to the restaurant menu page.
    try {
        console.log("POST: controller/signup");
        const data = req.body,
            member = new Member(),
            new_member = await member.signupData(data);

        req.session.member = new_member;
        res.redirect("/resto/products/menu");
    } catch (error) {
        console.log(`Error, controller/signup, ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
    // An async function that renders the login page for restaurants.
    try {
        console.log("GET: controller/getLoginMyRestaurant");
        res.render("login-page");
    } catch (error) {
        console.log(`Error, controller/getLoginMyRestaurant, ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

restaurantController.loginProcess = async (req, res) => {
    // This function handles the restaurant login process. Once logged in, the restaurant's details are saved in the session and then redirected to the menu page.
    try {
        console.log("POST: controller/login");
        const data = req.body,
            member = new Member(),
            result = await member.loginData(data);

        req.session.member = result;
        req.session.save(function () {
            // ikkala joyga (browser va mongoDB) ham save qilgancha kut degani
            res.redirect("/resto/products/menu");
        });
    } catch (error) {
        console.log(`Error, controller/login, ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

restaurantController.logout = (req, res) => {
    console.log("GET controller/logout");
    res.send("You are in logout section");
};

restaurantController.validateAuthRestaurant = (req, res, next) => {
    // A middleware function that checks if the session exists and if the member type in the session is "RESTAURANT". If so, it assigns the session member details to req.member and calls next() to continue to the next middleware or function; otherwise, it sends an error response.
    // It adds an extra layer of security, ensuring that only authenticated restaurants can access certain routes.
    if (req.session?.member?.mb_type === "RESTAURANT") {
        req.member = req.session.member;
        next();
    } else
        res.json({
            state: "fail",
            message:
                "Only authenticated members with restaurant type are allowed",
        });
};

restaurantController.checkSessions = (req, res) => {
    // Checks if the session has a member and responds with the member details if present, else responds with a failure message.
    if (req.session?.member) {
        res.json({ state: "succeed", data: req.session.member });
    } else {
        res.json({ state: "fail", message: "You are not authenticated." });
    }
};
