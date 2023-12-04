// Dependencies:
const MemberModel = require("../schema/member.model"); //A Mongoose model for interacting with the member collection in MongoDB.
const Definer = require("../lib/mistake"); // A utility class that contains predefined error messages.
const assert = require("assert"); // A Node.js built-in module for making assertions.
const bcrypt = require("bcryptjs"); // A library for hashing and comparing passwords.

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
            try {
                result = await new_member.save();
            } catch (mongo_err) {
                console.log(mongo_err);
                throw new Error(Definer.auth_err1);
            }

            console.log(result);

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

            assert.ok(member, Definer.err_auth3);

            const isMatch = await bcrypt.compare(
                input.mb_password,
                member.mb_password
            );
            assert.ok(isMatch, Definer.err_auth4);

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
}

//code provides a Member class that interacts with a MongoDB database using the Mongoose library. The class offers two functionalities - signing up and logging in a member.

module.exports = Member;
