// Code defines a Mongoose schema for a MongoDB collection named "Product"
// Required Modules:
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Mongoose is imported and the Schema object is destructured from it for ease of use.

// Enumerated (sanab o'tilgan) values
const {
    product_collection_enums,
    product_status_enums,
    product_size_enums,
    product_volume_enums,
} = require("../lib/config"); // These values imported from a config module, representing the allowed values for certain fields in the schema.

// Schema Definition:
const productSchema = new mongoose.Schema(
    {
        product_name: { type: String, required: true },
        product_collection: {
            // Specifies the collection the product belongs to, and must be one of the values in product_collection_enums.
            type: String,
            required: true,
            enum: {
                values: product_collection_enums,
                message: "{VALUE} is not among permitted enum values",
            },
        },
        product_status: {
            // Represents the product's status (defaulting to "PAUSED") and must be among the values in product_status_enums.
            type: String,
            required: false,
            default: "PAUSED",
            enum: {
                values: product_status_enums,
                message: "{VALUE} is not among permitted enum values",
            },
        },
        product_price: {
            type: Number,
            required: true,
        },
        product_discount: {
            type: Number,
            required: false,
            default: 0,
        },
        product_left_cnt: {
            // Indicates the number of that product left in stock.
            type: Number,
            required: true,
        },
        product_size: {
            // Specifies the size of the product. Its requirement depends on whether the product_collection is one of "dish", "salad", or "dessert".
            type: String,
            default: "normal",
            required: function () {
                const sized_list = ["dish", "salad", "dessert"];
                return sized_list.includes(this.product_collection);
            },
            enum: {
                values: product_size_enums,
                message: "{VALUE} is not among permitted enum values",
            },
        },
        product_volume: {
            // product_volume: Specifies the volume of the product and is required only if the product_collection is "drink".
            type: Number,
            default: 1,
            required: function () {
                return this.product_collection === "drink";
            },
            enum: {
                values: product_volume_enums,
                message: "{VALUE} is not among permitted enum values",
            },
        },
        product_description: { type: String, required: true },
        product_images: { type: Array, required: false, default: [] }, // An array to store image URLs or data related to the product.
        product_likes: {
            // Numeric fields indicating user interactions with the product.
            type: Number,
            required: false,
            default: 0,
        },
        product_views: {
            // Numeric fields indicating user interactions with the product.
            type: Number,
            required: false,
            default: 0,
        },
        restaurant_mb_id: {
            // A reference to the Member schema, linking the product to a particular restaurant or member.
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: false,
        },
    },
    { timestamps: true } // It ensures automatic management of createdAt and updatedAt timestamps.
);

// Schema Indexing:
productSchema.index(
    // An index is created to ensure that the combination of restaurant_mb_id, product_name, product_size, and product_volume is unique in the database. This ensures that there aren't duplicate products with the same name, size, and volume from the same restaurant.
    {
        restaurant_mb_id: 1,
        product_name: 1,
        product_size: 1,
        product_volume: 1,
    },
    { unique: true }
);

// Model Creation and Export:
module.exports = mongoose.model("Product", productSchema);
// The schema is converted into a model. The model represents the "Product" collection in the database (though Mongoose will pluralize the collection name to "Products"). The model is then exported to be used elsewhere in the application.
