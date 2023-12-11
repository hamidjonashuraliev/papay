const Order = require("../models/Order.js");
// function is an asynchronous route handler in a Node.js application for creating an order.

let orderController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");

orderController.createOrder = async (req, res) => {
  try {
    console.log("POST: cont/createOrder");
    assert.ok(req.member, Definer.auth_err5);
    // It first asserts that the req.member exists, using the assert.ok method with a custom error message

    const order = new Order();
    const result = await order.createOrderData(req.member, req.body);
    // If the assertion passes, it creates a new Order instance and calls createOrderData with req.member and req.body as arguments to create an order.

    res.json({ state: "success", data: result }); // The result is then sent back in a JSON response.
  } catch (err) {
    console.log(`ERROR, cont/createOrder, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
