const assert = require("assert"); // A module for asserting truthy values.
const { shapeIntoMongooseObjectId } = require("../lib/config");
// utility function that converts some value into a Mongoose ObjectID.
const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");

class Product {
    constructor() {
        this.productModel = ProductModel; //Initializes the productModel property with the given ProductModel.
    }

    async getAllProductsDataResto(member) {
        try {
            member._id = shapeIntoMongooseObjectId(member._id);
            const result = await this.productModel.find({
                restaurant_mb_id: member._id,
            });
            assert.ok(result, Definer.general_err1);
            console.log("RESULT:::", result);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async addNewProductData(data, member) {
        try {
            data.restaurant_mb_id = shapeIntoMongooseObjectId(member._id); // Converts the member _id to a Mongoose ObjectId and adds it to the data object as restaurant_mb_id.
            // Then it creates a new product document with the given data and saves it to the database.
            const new_product = new this.productModel(data);
            const result = await new_product.save();

            assert.ok(result, Definer.product_err1);
            // The result of the save operation is then checked with assert.ok() to ensure it's truthy, and if it's not, an error with a message from Definer.product_err1 is thrown.

            return result;
        } catch (err) {
            throw err;
        }
    }

    async updateChosenProductData(id, updated_data, mb_id) {
        try {
            // Converts the given id and mb_id to Mongoose ObjectIds.
            id = shapeIntoMongooseObjectId(id);
            mb_id = shapeIntoMongooseObjectId(mb_id);

            // Then it tries to find a product document in the database with the given id and restaurant_mb_id equal
            // to mb_id, and updates it with the updated_data.
            const result = await this.productModel
                // The findOneAndUpdate method options ensure that:
                // The provided data goes through validation (runValidators: true).
                // The updated document is returned (returnDocument: "after" vs before).
                // The result of the operation is lean (lean: true), meaning it returns a plain JavaScript object instead of a Mongoose document.

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
            // After the update, it checks the result with assert.ok() to ensure it's truthy, and if not,
            // an error with a message from Definer.general_err1 is thrown.
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Product;

// This Product class provides methods to interact with the Product Schema Model
// (which represents a Mongoose schema model for the Product collection in MongoDB).
