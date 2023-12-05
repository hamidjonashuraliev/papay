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

    async updateChosenProductData(id, updated_data, mb_id) {
        try {
            id = shapeIntoMongooseObjectId(id);
            mb_id = shapeIntoMongooseObjectId(mb_id);

            const result = await this.productModel
                .findOneAndUpdate(
                    { _id: id, restaurant_mb_id: mb_id },
                    updated_data,
                    {
                        runValidators: true,
                        lean: true,
                        returnDocument: "after",
                    }
                )
                .exec();

            assert.ok(result, Definer.general_err1);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Product;
