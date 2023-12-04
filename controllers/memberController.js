// member-related controller in papay adminka web application
let memberController = module.exports;
const Member = require("../models/Member"); //  imports the Member model, which a class responsible for handling database interactions related to members.

memberController.signup = async (req, res) => {
    // This asynchronous function handles member signup. When a POST request is made to the corresponding route:
    try {
        console.log("POST: controller/signup requested");
        const data = req.body, // Extracts the request body (submitted data).
            member = new Member(), // Instantiates a new Member object.
            new_member = await member.signupData(data); // Calls the signupData method on the Member object, passing the extracted data.

        res.json({ state: "succeed", data: new_member });
        // If successful, it returns a JSON response with the state "succeed" to FE and the new member's data.
    } catch (error) {
        // If an error occurs, the error is logged, and a JSON response with the state "fail" is sent.
        console.log(`Error, controller/signup ${error.message}`);
        res.json({ state: "fail", message: error.message });
        // It ensures the client is informed when something goes wrong.
    }
};

memberController.login = async (req, res) => {
    try {
        console.log("POST: controller/login requested");
        const data = req.body,
            member = new Member(),
            result = await member.loginData(data);

        res.json({ state: "succeed", data: result });
        // On success, sends a JSON response indicating the successful login state and returns the relevant data.
    } catch (error) {
        console.log(`Error, controller/login ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

memberController.logout = (req, res) => {
    // typically, logging out would involve clearing or invalidating a user's session.
    console.log("GET controller/logout requested");
    res.send("Welcome to logout page");
};
