const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "RESTAURANT"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
// deleted (soft delete, where the record is marked as deleted but not actually removed).
exports.ordinary_enums = ["Y", "N"];
// boolean equivalent, where "Y" stands for 'Yes' and "N" for 'No'.

exports.product_collection_enums = ["dish", "salad", "dessert", "drink", "etc"];
// Products can be categorized as a dish, salad, dessert, drink, or some other category ("etc").
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_size_enums = ["small", "normal", "large", "set"];
exports.product_volume_enums = [0.5, 1, 1.2, 1.5, 2];
// These enumerated values ensure consistency across the application and prevent invalid data from being entered. For example, when creating a new product, one might check that the provided size is one of the values in product_size_enums. If it's not, the application can reject the input or inform the user of the valid options.

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.like_view_group_list = ["product", "member", "community"];
exports.board_id_enum_list = ["celebrity", "evaluation", "story"];
exports.board_article_status_enum_list = ["active", "deleted"];

// MongoDB related commands
exports.shapeIntoMongooseObjectId = (target) => {
    if (typeof target === "string") {
        return new mongoose.Types.ObjectId(target);
    } else return target;
};

exports.lookup_auth_member_following = (mb_id, origin) => {
    const follow_id = origin === "follows" ? "$subscriber_id" : "$_id";
    return {
        $lookup: {
            from: "follows",
            let: {
                lc_follow_id: follow_id,
                lc_subscriber_id: mb_id,
                nw_my_following: true,
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$follow_id", "$$lc_follow_id"] },
                                {
                                    $eq: [
                                        "$subscriber_id",
                                        "$$lc_subscriber_id",
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        subscriber_id: 1,
                        follow_id: 1,
                        my_following: "$$nw_my_following",
                    },
                },
            ],
            as: "me_followed",
        },
    };
};

exports.lookup_auth_member_liked = (mb_id) => {
    return {
        $lookup: {
            from: "likes",
            let: {
                lc_liken_item_id: "$_id",
                lc_mb_id: mb_id,
                nw_my_favorite: true,
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$like_ref_id", "$$lc_liken_item_id"] },
                                { $eq: ["$mb_id", "$$lc_mb_id"] },
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        mb_id: 1,
                        like_ref_id: 1,
                        my_favorite: "$$nw_my_favorite",
                    },
                },
            ],
            as: "me_liked",
        },
    };
};
