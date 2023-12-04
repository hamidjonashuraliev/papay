let restaurantController = module.exports;
const Member = require("../models/Member");

restaurantController.getMyRestaurantData = async (req, res) => {
    try {
        console.log("GET: controller/getMyRestaurantData");
        // TODO: Get my restaurant products

        res.render("restaurant-menu");
    } catch (error) {
        console.log(`Error, controller/getMyRestaurantData, ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

restaurantController.getSignupMyRestaurant = async (req, res) => {
    try {
        console.log("GET: controller/getSignupMyRestaurant");
        res.render("signup");
    } catch (error) {
        console.log(`Error, controller/signup, ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

restaurantController.signupProcess = async (req, res) => {
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
    try {
        console.log("GET: controller/getLoginMyRestaurant");
        res.render("login-page");
    } catch (error) {
        console.log(`Error, controller/getLoginMyRestaurant, ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

restaurantController.loginProcess = async (req, res) => {
    try {
        console.log("POST: controller/login");
        const data = req.body,
            member = new Member(),
            result = await member.loginData(data);

        req.session.member = result;
        req.session.save(function () {
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

restaurantController.checkSessions = (req, res) => {
    if (req.session?.member) {
        res.json({ state: "succeed", data: req.session.member });
    } else {
        res.json({ state: "fail", message: "You are not authenticated." });
    }
};
