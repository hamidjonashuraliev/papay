const assert = require("assert"); // A module for asserting truthy values.
const { shapeIntoMongooseObjectId } = require("../lib/config");
// utility function that converts some value into a Mongoose ObjectID.
const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");

class Product {
    constructor() {
        this.productModel = ProductModel;
    }

    async addNewProductData(data, member) {
        try {
            data.restaurant_mb_id = shapeIntoMongooseObjectId(member._id);

            const new_product = new this.productModel(data);
            const result = await new_product.save();

            assert.ok(result, Definer.product_err1);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Product;
