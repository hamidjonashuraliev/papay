// This code defines a Mongoose schema for an "Order" collection in MongoDB
const mongoose = require("mongoose");
const { order_status_enums } = require("../lib/config");
const Schema = mongoose.Schema;

const followSchema = new mongoose.Schema(
    {
        follow_id: { type: Schema.Types.ObjectId, required: true },
        subscriber_id: { type: Schema.Types.ObjectId, required: true },
    },
    { timestamps: true }
);
followSchema.index({ follow_id: 1, subscriber_id: 1 }, { unique: true });

module.exports = mongoose.model("Follow", followSchema);
// This schema structure is designed to manage and store order data efficiently in a database.
