const Users = require("../database/models/user");
const utils = require('../utils')
const userResolver = {
  Query: {
    searchByName: ({ name }) => {
      return Users.findOne({ name: name });
    },
    getAllUsers: async (_, args, context) => {
      // if (!context.userIsAuthorized) {
      //   throw new Error("Unauthorized");
      // }

      const { firstname,lastname, email, age, limit = 10, skip = 0 } = args;

      let query = [];

      if (firstname) {
        query.push({ firstname: firstname });
      }

      if (email) {
        query.push({ email: { $regex: email } });
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
      login: async (_, { email, password }) => {
        // Trouver l'utilisateur par email
        const user = await Users.findOne({ email });

        if (!user) {
          throw new Error("No such user found");
        }

        // Vérifier le mot de passe
        const valid = utils.ValidatePassword(
          password,
          user.password,
          user.salt
        );

        if (!valid) {
          throw new Error("Invalid password");
        }

        // Générer un token JWT
        const token = utils.GenerateSignature({
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          speciality: user.speciality,
          email: user.email,
        });

        // Retourner l'utilisateur et le token
        return {
          token,
          user,
        };
      },
    createUser: async (_, args) => {
      try {
        const user = new Users(args.user);
        const savedUser = await user.save();

        const token = utils.GenerateSignature({
          id: savedUser._id,
          firstname: savedUser.firstname,
          lastname: savedUser.lastname,
          role: savedUser.role,
          speciality: savedUser.speciality,
          email: savedUser.email,
        });
        savedUser.token = token;

        // Destructure the properties you want from savedUser
        const { _id,firstname, lastname, role, speciality, email } = savedUser;

        // Return a new object with only the properties you want
        return { id: _id,firstname, lastname, role, speciality, email };
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
  User: {
    __resolveReference(user) {
      return Users.findById(user.id);
    },
  },
};

module.exports = userResolver;
