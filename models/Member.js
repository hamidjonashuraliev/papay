// Dependencies:
const MemberModel = require("../schema/member.model"); //A Mongoose model for interacting with the member collection in MongoDB.
const Definer = require("../lib/mistake"); // A utility class that contains predefined error messages.
const assert = require("assert"); // A Node.js built-in module for making assertions.
const bcrypt = require("bcryptjs"); // A library for hashing and comparing passwords.
const {
    shapeIntoMongooseObjectId,
    lookup_auth_member_following,
} = require("../lib/config.js");
const View = require("./View.js");
const Like = require("./Like.js");

class Member {
    constructor() {
        // Initializes the memberModel property with the MemberModel Mongoose model.
        this.memberModel = MemberModel;
    }

    async signupData(input) {
        // This method is responsible for signing up a new member.
        try {
            // First, it hashes the password using bcrypt (hashing is a good practice for storing passwords securely).
            const salt = await bcrypt.genSalt();
            input.mb_password = await bcrypt.hash(input.mb_password, salt);

            const new_member = new this.memberModel(input);
            let result;
            console.log("new_member::: ", new_member);
            try {
                result = await new_member.save();
                console.log("result::: ", result);
            } catch (mongo_err) {
                console.log(mongo_err);
                throw new Error(Definer.mongo_validation_err_1);
            }

            // console.log(result);

            result.mb_password = "";
            // for security reasons, the method erases the password from the result object before returning it.
            return result;
        } catch (error) {
            throw error;
        }
    }

    async loginData(input) {
        //This method is responsible for logging in a member.
        try {
            const member = await this.memberModel
                .findOne(
                    { mb_nick: input.mb_nick },
                    { mb_nick: 1, mb_password: 1 }
                )
                .exec();
            // It starts by fetching a member from the database based on the provided nickname (mb_nick).

            assert.ok(member, Definer.auth_err3);

            const isMatch = await bcrypt.compare(
                input.mb_password,
                member.mb_password
            );
            assert.ok(isMatch, Definer.auth_err4);

            return await this.memberModel
                // If everything is successful, it fetches and returns the full member data.
                .findOne({
                    mb_nick: input.mb_nick,
                })
                .exec();
        } catch (err) {
            throw err;
        }
    }

    async getChosenMemberData(member, id) {
        try {
            const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
            id = shapeIntoMongooseObjectId(id);
            console.log("member:::", member);
            let aggregateQuery = [
                { $match: { _id: id, mb_status: "ACTIVE" } },
                { $unset: "mb_password" },
            ];

            if (member) {
                // condition if not seen before
                await this.viewChosenItemByMember(member, id, "member");

                // todo: check auth member  liked the chosen target.
                aggregateQuery.push(
                    lookup_auth_member_following(auth_mb_id, "members")
                );
            }

            const result = await this.memberModel
                .aggregate(aggregateQuery)
                .exec();

            assert.ok(result, Definer.general_err2);
            return result[0];
        } catch (err) {
            throw err;
        }
    }

    async viewChosenItemByMember(member, view_ref_id, group_type) {
        try {
            view_ref_id = shapeIntoMongooseObjectId(view_ref_id);
            const mb_id = shapeIntoMongooseObjectId(member._id);

            const view = new View(mb_id);
            const isValid = await view.validateChosenTarget(
                view_ref_id,
                group_type
            );
            console.log("isValid:", isValid);
            assert.ok(isValid, Definer.general_err2);

            // logged user has seen target before
            const doesExist = await view.checkViewExistence(view_ref_id);
            console.log("doesExist:::", doesExist);

            if (!doesExist) {
                const result = await view.insertMemberView(
                    view_ref_id,
                    group_type
                );
                assert.ok(result, Definer.general_err1);
            }

            return true;
        } catch (err) {
            throw err;
        }
    }
    async likeChosenItemByMember(member, like_ref_id, group_type) {
        try {
            like_ref_id = shapeIntoMongooseObjectId(like_ref_id);
            const mb_id = shapeIntoMongooseObjectId(member._id);

            const like = new Like(mb_id);

            const isValid = await like.validateTargetItem(
                like_ref_id,
                group_type
            );

            console.log("isValid::", isValid);
            assert.ok(isValid, Definer.general_err2);

            const doesExist = await like.checkLikeExistence(like_ref_id);
            console.log("doesExist::", doesExist);

            let data = doesExist
                ? await like.removeMemberLike(like_ref_id, group_type)
                : await like.insertMemberLike(like_ref_id, group_type);
            assert.ok(data, Definer.general_err1);

            const result = {
                like_group: data.like_group,
                like_ref_id: data.like_ref_id,
                like_status: doesExist ? 0 : 1,
            };
            return result;
        } catch (err) {
            throw err;
        }
    }
}

//code provides a Member class that interacts with a MongoDB database using the Mongoose library. The class offers two functionalities - signing up and logging in a member.

module.exports = Member;
