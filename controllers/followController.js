const assert = require("assert");
const Definer = require("../lib/mistake");
const Follow = require("../models/Follow.js");

let followController = module.exports;
followController.subscribe = async (req, res) => {
    try {
        console.log("POST: cont/subscribe");
        assert.ok(req.member, Definer.auth_err5);
        const follow = new Follow();
        await follow.subscribeData(req.member, req.body);

        res.json({ state: "success", data: "subscribed" });
    } catch (err) {
        console.log(`Error, cont/subscribe, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};
