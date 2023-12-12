const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const OrderModel = require("../schema/order.model");
const OrderItemModel = require("../schema/order_item.model");
// The Order class in this code is designed to manage order data in a Node.js application, interfacing with MongoDB through Mongoose models.

class Order {
    constructor() {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
    }

    async createOrderData(member, data) {
        //  This method calculates the total amount of an order by iterating over each item in the data array, summing up the products of quantities and prices. It adds a delivery cost if the total amount is below a certain threshold, then saves the order data using saveOrderData method and logs the generated order ID.
        try {
            let order_total_amount = 0,
                delivery_cost = 0;
            const mb_id = shapeIntoMongooseObjectId(member._id);

            data.map((item) => {
                order_total_amount += item["quantity"] * item["price"];
            });

            if (order_total_amount < 100000) {
                delivery_cost = 4000;
                order_total_amount += delivery_cost;
            }

            const order_id = await this.saveOrderData(
                order_total_amount,
                delivery_cost,
                mb_id
            );

            console.log("order_id::", order_id);
            //TODO: order items creation
            await this.recordOrderItemsData(order_id, data);
            return order_id;
        } catch (err) {
            throw err;
        }
    }

    async saveOrderData(order_total_amount, delivery_cost, mb_id) {
        // This method creates a new order document with the total amount, delivery cost, and member ID (mb_id). It saves the order to the database using the orderModel and returns the _id of the created order. It includes error handling with assertions and custom error messages.
        try {
            const new_order = new this.orderModel({
                order_total_amount: order_total_amount,
                order_delivery_cost: delivery_cost,
                mb_id: mb_id,
            });

            const result = await new_order.save();
            assert.ok(result, Definer.order_err1);

            return result._id;
        } catch (err) {
            console.log(err);
            throw new Error(Definer.order_err1);
        }
    }

    async recordOrderItemsData(order_id, data) {
        try {
            const pro_list = data.map(async (item) => {
                return await this.saveOrderItemsData(item, order_id);
            });

            const results = await Promise.all(pro_list);
            console.log("results:::", results);
            return true;
        } catch (err) {
            throw err;
        }
    }

    async saveOrderItemsData(item, order_id) {
        try {
            order_id = shapeIntoMongooseObjectId(order_id);
            item._id = shapeIntoMongooseObjectId(item._id);

            const order_item = new this.orderItemModel({
                item_quantity: item["quantity"],
                item_price: item["price"],
                order_id: order_id,
                product_id: item["_id"],
            });
            const result = await order_item.save();
            assert.ok(result, Definer.order_err2);
            return "created";
        } catch (err) {
            console.log(err);
            throw new Error(Definer.order_err2);
        }
    }

    async getMyOrdersData(member, query) {
        // asynchronous function designed to retrieve a member's orders from a MongoDB database using the Mongoose ODM
        try {
            const mb_id = shapeIntoMongooseObjectId(member._id), // Converts the member's _id to a MongoDB ObjectId.
                order_status = query.status.toUpperCase(),
                matches = { mb_id: mb_id, order_status: order_status };

            const result = await this.orderModel
                // This method is structured to handle complex data retrieval involving joining data from multiple collections, providing comprehensive order details for the member.
                .aggregate([
                    // Aggregation Pipeline:
                    { $match: matches },
                    // Filters documents in the orderModel collection based on the match criteria.
                    { $sort: { createdAt: -1 } },
                    // Sorts the results in descending order based on the createdAt timestamp.
                    {
                        $lookup: {
                            // with "orderitems": Joins data from the "orderitems" collection to the orders based on the order_id.
                            from: "orderitems",
                            localField: "_id",
                            foreignField: "order_id",
                            as: "order_items",
                        },
                    },
                    {
                        $lookup: {
                            // with "products": Joins product data from the "products" collection to the items in the order.
                            from: "products",
                            localField: "order_items.product_id",
                            foreignField: "_id",
                            as: "product_data",
                        },
                    },
                ])
                .exec();
            // Executes the aggregation pipeline and returns the results, which include the orders with their associated items and product data.
            console.log("req.query:", result);
            return result;
        } catch (err) {
            throw err;
        }
    }
    
    async editChosenOrderData(member, data) {
        try {
            const mb_id = shapeIntoMongooseObjectId(member._id),
                order_id = shapeIntoMongooseObjectId(data.order_id),
                order_status = data.order_status.toUpperCase();

            const result = await this.orderModel.findOneAndUpdate(
                { mb_id: mb_id, _id: order_id },
                { order_status: order_status },
                { runValidators: true, lean: true, returnDocument: "after" }
            );
            // console.log(result);

            assert.ok(result, Definer.order_err3);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Order;
// The class constructor initializes with OrderModel and OrderItemModel, likely representing MongoDB collections for orders and order items. The class structure aids in encapsulating the logic for order creation and management within the application.
