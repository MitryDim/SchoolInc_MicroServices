const Users = require("../database/models/user");
const utils = require('../utils')
const userResolver = {
  Query: {
    searchByName: ({ name }) => {
      return Users.findOne({ name: name });
    },
    getAllUsers: async (_, args,context) => {
      if (!context.userIsAuthorized) {
        throw new Error("Unauthorized");
      }

      const { name, email, age, limit = 10, skip = 0 } = args;

      console.log("search ", name, email, age, limit, skip);
      let query = [];

      if (name) {
        query.push({ name: name });
      }

      if (email) {
        query.push({ email: { $regex: email } });
      }

      if (age) {
        query.push({ age: { $gte: age } });
      }

      if (query.length === 0) {
        console.log("no results");
        return await Users.find().skip(skip).limit(limit);
      } else {
        return await Users.find({ $or: query }).skip(skip).limit(limit);
      }
    },
  },
  Mutation: {
    createUser: async (_, args) => {
      try {
        console.log("create user")
        const user = new Users(args.user);
        const savedUser = await user.save();

        const token = utils.GenerateSignature({id: savedUser._id, name: savedUser.name, email: savedUser.email });
        savedUser.token = token;       
         console.log("saved user", savedUser);
        return savedUser;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    createUsers: async ({ users1 }) => {
      try {
        await Users.insertMany(users1);
        return "Users created successfully";
      } catch (err) {
        throw new Error(`error during insertUser: ${err.message}`);
      }
    },
    updateUser: async (_, args, context) => {
      if (!context.userIsAuthorized) {
        throw new Error("Unauthorized");
      }
      const { id, user } = args;
      const update = {
        ...(user.name && { name: user.name }),
        ...(user.email && { email: user.email }),
        ...(user.age && { age: user.age }),
      };

      const result = await Users.findByIdAndUpdate(
        id,
        { $set: update },
        { returnDocument: "after" }
      );

      if (!result) {
        throw new Error(`No user found with id: ${id}`);
      }
      return result;
    },
    deleteUser: async (_, args) => {
      const { id } = args;
      const result = await Users.findByIdAndDelete(id);
      if (result?.deletedCount === 0) {
        throw new Error(`No user found with id: ${id}`);
      }
      return `User with id: ${id} was deleted successfully`;
    },
  },
};

module.exports = userResolver;
