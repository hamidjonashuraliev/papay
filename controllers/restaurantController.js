// This controller handles various functionalities related to restaurant management and authentication.
const assert = require("assert");
const Definer = require("../lib/mistake");
const Member = require("../models/Member");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");

let restaurantController = module.exports;
restaurantController.getRestaurants = async (req, res) => {
    try {
        console.log("GET: controller/getRestaurants");
        const data = req.query,
            restaurant = new Restaurant(),
            result = await restaurant.getRestaurantsData(req.member, data);

        res.json({state: "success", data: result });
    } catch (err) {
        console.log(`ERROR, cont/home, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

/********************************
 *    BSSR RELATED METHODS      *
 * ******************************/

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
        res.redirect("/resto");
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
        console.log("POST: controller/signupProcess");
        assert(req.file, Definer.general_err3); //file - single file

        let new_member = req.body;
        // console.log("POST: req.body:::", req.body);
        // res.send("OK");
        new_member.mb_type = "RESTAURANT"; //because req comming to adinka
        new_member.mb_image = req.file.path; // pass property of file object

        const member = new Member();
        const result = await member.signupData(new_member);
        assert(req.file, Definer.general_err1);

        req.session.member = result;
        res.redirect("/resto/products/menu"); //restaurant user bolganligi uchun products menuga redirect
    } catch (error) {
        console.log(`Error, controller/signupProcess, ${error.message}`);
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
        console.log("POST: controller/loginProcess");
        const data = req.body,
            member = new Member(),
            result = await member.loginData(data);

        req.session.member = result;
        req.session.save(function () {
            // ikkala joyga (browser va mongoDB) ham save qilgancha kut degani
            result.mb_type === "ADMIN"
                ? res.redirect("/resto/all-restaurants")
                : res.redirect("/resto/products/menu");
        });
    } catch (error) {
        console.log(`Error, controller/loginProcess, ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

restaurantController.logout = (req, res) => {
    try {
        console.log("GET cont/logout");
        req.session.destroy(function () {
            res.redirect("/resto");
        });
    } catch (err) {
        console.log(`ERROR, cont/logout, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
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
        res.json({ state: "success", data: req.session.member });
    } else {
        res.json({ state: "fail", message: "You are not authenticated." });
    }
};

restaurantController.validateAdmin = (req, res, next) => {
    if (req.session?.member?.mb_type === "ADMIN") {
        req.member = req.session.member;
        next();
    } else {
        const html = `<script>
      alert('Admin page: Permission denied');
      window.location.replace('/resto');
    </script>`;
        res.end(html);
    }
};

restaurantController.getAllRestaurants = async (req, res) => {
    try {
        console.log("GET cont/getAllRestaurants");

        const restaurant = new Restaurant();
        const restaurants_data = await restaurant.getAllRestaurantsData();
        console.log("restaurants_data:", restaurants_data);
        res.render("all-restaurants", { restaurants_data: restaurants_data });
    } catch (err) {
        console.log(`ERROR, cont/getAllRestaurants, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

restaurantController.updateRestaurantByAdmin = async (req, res) => {
    try {
        console.log("GET cont/updateRestaurantByAdmin");
        const restaurant = new Restaurant();
        const result = await restaurant.updateRestaurantByAdmin(req.body);
        await res.json({ state: "success", data: result });
    } catch (err) {
        console.log(`ERROR, cont/updateRestaurantByAdmin, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};
