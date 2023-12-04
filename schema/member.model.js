// Code defines a Mongoose schema for a MongoDB collection named "<Member>"
const mongoose = require("mongoose");
const {
    member_type_enums,
    member_status_enums,
    ordinary_enums,
} = require("../lib/config");

// Schema Definition
const memberSchema = new mongoose.Schema(
    // The schema represents the structure of a document in the "Member" collection of MongoDB.
    {
        mb_nick: {
            // A unique identifier (nickname) for the member.
            type: String,
            required: true,
            index: { unique: true, sparse: true },
        },
        mb_phone: {
            type: String,
            required: true,
            index: { unique: true, sparse: true },
        },
        mb_password: {
            type: String,
            required: true,
            select: false, // ensures that when querying, the password won't be returned unless explicitly requested).
        },
        mb_type: {
            type: String,
            required: false,
            default: "USER",
            enum: {
                // The use of enums ensures that certain fields have values restricted to a predefined set.
                values: member_type_enums,
                message: "{VALUE} is not among permitted values",
            },
        },
        mb_status: {
            type: String,
            required: false,
            default: "ACTIVE",
            enum: {
                values: member_status_enums,
                message: "{VALUE} is not among permitted values",
            },
        },
        mb_full_name: {
            type: String,
            required: false,
        },
        mb_address: {
            type: String,
            required: false,
        },
        mb_description: {
            type: String,
            required: false,
        },
        mb_image: {
            type: String,
            required: false,
        },
        mb_point: {
            type: Number,
            required: false,
            default: 0,
        },
        mb_top: {
            type: String,
            required: false,
            default: "N",
            enum: {
                values: ordinary_enums,
                message: "{VALUE} is not among permitted values",
            },
        },
        mb_views: {
            type: Number,
            required: false,
            default: 0,
        },
        mb_likes: {
            type: Number,
            required: false,
            default: 0,
        },
        mb_follow_cnt: {
            type: Number,
            required: false,
            default: 0,
        },
        mb_subscriber_cnt: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    { timestamps: true } // utility fields
);

module.exports = mongoose.model("Member", memberSchema);
