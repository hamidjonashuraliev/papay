let restaurantController = module.exports;
const Member = require("../models/Member");

restaurantController.getSignupMyRestaurant = async (req, res) => {
  try {
    console.log("GET: controller getSignupMyRestaurant");
    res.render("signup");
  } catch (error) {
    console.log(`Error, controller signup, ${error.message}`);
    res.json({ state: "fail", message: error.message });
  }
};

restaurantController.signupProcess = async (req, res) => {
  try {
    console.log("POST: controller signup");
    const data = req.body,
      member = new Member(),
      new_member = await member.signupData(data);

    res.json({ state: "succeed", data: new_member });
  } catch (error) {
    console.log(`Error, controller signup, ${error.message}`);
    res.json({ state: "fail", message: error.message });
  }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
  try {
    console.log("GET: controller getLoginMyRestaurant");
    res.render("login-page");
  } catch (error) {
    console.log(`Error, controller getLoginMyRestaurant, ${error.message}`);
    res.json({ state: "fail", message: error.message });
  }
};

restaurantController.loginProcess = async (req, res) => {
  try {
    console.log("POST: controller login");
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data);

    res.json({ state: "succeed", data: result });
  } catch (error) {
    console.log(`Error, controller login, ${error.message}`);
    res.json({ state: "fail", message: error.message });
  }
};

restaurantController.logout = (req, res) => {
  console.log("GET controller logout");
  res.send("You are in logout section");
};
