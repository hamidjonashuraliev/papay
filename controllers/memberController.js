// member-related controller in papay adminka web application
let memberController = module.exports;
const Member = require("../models/Member"); //  imports the Member model, which a class responsible for handling database interactions related to members.
const jwt = require("jsonwebtoken");
const assert = require("assert");
const Definer = require("../lib/mistake");

memberController.signup = async (req, res) => {
    // This asynchronous function handles member signup. When a POST request is made to the corresponding route:
    try {
        console.log("POST: controller/signup requested");
        const data = req.body, // Extracts the request body (submitted data).
            member = new Member(), // Instantiates a new Member object.
            new_member = await member.signupData(data); // Calls the signupData method on the Member object, passing the extracted data.
        // console.log("result::::::::", result);
        const token = memberController.createToken(new_member);
        // console.log("token::::::::", token);

        res.cookie("access_token", token, {
            maxAge: 6 * 3600 * 1000,
            httpOnly: true,
        });

        res.json({ state: "success", data: new_member });
        // If successful, it returns a JSON response with the state "success" to FE and the new member's data.
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
        // console.log("result::::::::", result);

        const token = memberController.createToken(result);
        // console.log("token::::::::", token);

        res.cookie("access_token", token, {
            maxAge: 6 * 3600 * 1000,
            httpOnly: true,
        });

        res.json({ state: "success", data: result });
        // On success, sends a JSON response indicating the successful login state and returns the relevant data.
    } catch (error) {
        console.log(`Error, controller/login ${error.message}`);
        res.json({ state: "fail", message: error.message });
    }
};

memberController.logout = (req, res) => {
    // typically, logging out would involve clearing or invalidating a user's session.
    console.log("GET controller/logout requested");
    res.cookie("access_token", null, { maxAge: 0, httpOnly: true });
    res.json({ state: "success", data: "logout successful" });
};

// WEB tokens JWT

memberController.createToken = (result) => {
    try {
        const upload_data = {
            _id: result._id,
            mb_nick: result.mb_nick,
            mb_type: result.mb_type,
        };

        const token = jwt.sign(upload_data, process.env.SECRET_TOKEN, {
            expiresIn: "6h",
        });

        assert.ok(token, Definer.auth_err2);
        return token;
    } catch (err) {
        throw err;
    }
};

memberController.checkMyAuthentication = (req, res) => {
    try {
        console.log("GET cont/checkMyAuthentication");
        let token = req.cookies["access_token"];
        // console.log("token:::", token);   

        const member = token
            ? jwt.verify(token, process.env.SECRET_TOKEN)
            : null;
        assert.ok(member, Definer.auth_err2);

        res.json({ state: "success", data: member });
    } catch (err) {
        throw err;
    }
};

memberController.getChosenMember = async (req, res) => {
    try {
        console.log("GET cont/getChosenMember");
        const id = req.params.id;

        const member = new Member();
        const result = await member.getChosenMemberData(req.member, id);

        res.json({ state: "success", data: result });
    } catch (err) {
        console.log(`ERROR, cont/getChosenMember, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

memberController.retrieveAuthMember = (req, res, next) => {
    try {
        const token = req.cookies["access_token"];
        req.member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
        next();
    } catch (err) {
        console.log(`ERROR, cont/retrieveAuthMember, ${err.message}`);
        next();
    }
};
