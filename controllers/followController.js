const assert = require("assert");
const Definer = require("../lib/mistake");
const Follow = require("../models/Follow");

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

followController.unsubscribe = async (req, res) => {
    try {
        console.log("POST: cont/unsubscribe");
        assert.ok(req.member, Definer.auth_err5);
console.log("done:::", req.body);
        const follow = new Follow();
        await follow.unsubscribeData(req.member, req.body);

        res.json({ state: "success", data: "unsubscribe" });
    } catch (err) {
        console.log(`Error, cont/unsubscribe, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

followController.getMemberFollowings = async (req, res) => {
    try {
        console.log("GET: cont/getMemberFollowings");
        const follow = new Follow();
       const result =  await follow.getMemberFollowingsData(req.query);
       res.json({ state: "success", data: result});
    } catch (err) {
        console.log(`Error, cont/getMemberFollowings, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};