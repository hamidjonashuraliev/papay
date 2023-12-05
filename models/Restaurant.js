const assert = require("assert");
const Definer = require("../lib/mistake.js");
const MemberModel = require("../schema/member.model.js");
const { shapeIntoMongooseObjectId } = require("../lib/config.js");

class Restaurant {
    constructor() {
        this.memberModel = MemberModel;
    }

    async getAllRestaurantsData() {
        try {
            let result = await this.memberModel
                .find({
                    mb_type: "RESTAURANT",
                })
                .exec();

            assert(result, Definer.general_err1);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async updateRestaurantByAdmin(update_data) {
        try {
            const id = shapeIntoMongooseObjectId(update_data?.id);
            const result = await this.memberModel
                .findByIdAndUpdate({ _id: id }, update_data, {
                    runValidators: true,
                    lean: true,
                    returnDocument: "after",
                })
                .exec();
            assert(result, Definer.general_err1);
            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Restaurant;
