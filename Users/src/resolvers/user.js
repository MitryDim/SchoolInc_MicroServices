const Users = require("../database/models/user");
const utils = require("../utils");
const userResolver = {
  Query: {
    getUserById: async (_, { id }) => {
      return await Users.findById(id);
    },
    searchByName: async ({ name }) => {
      return await Users.findOne({ name: name });
    },
    getAllUsers: async (_, args, context) => {
      // if (!context.userIsAuthorized) {
      //   throw new Error("Unauthorized");
      // }

      const { firstname, lastname, email, age, limit = 10, skip = 0 } = args;

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
      const valid = utils.ValidatePassword(password, user.password, user.salt);

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

      const { _id, firstname, lastname, role, speciality } = user;
      return {
        id: _id,
        firstname,
        lastname,
        role,
        speciality,
        email: user?.email,
        token,
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
        const { _id, firstname, lastname, role, speciality, email } = savedUser;

        // Return a new object with only the properties you want
        return { id: _id, firstname, lastname, role, speciality, email, token };
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
        ...(user.firstname && { firstname: user.firstname }),
        ...(user.lastname && { lastname: user.lastname }),
        ...(user.role && { role: user.role }),
        ...(user.password && { password: user.password }),
        ...(user.speciality && { speciality: user.speciality }),
        ...(user.email && { email: user.email }),
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
    deleteUser: async (_, { usersIds }) => {
      // Map over the array of user IDs and update each user
      const updatedUsers = await Promise.all(
        usersIds.map(({ id }) =>
          Users.findByIdAndUpdate(id, { enable: false }, { new: true })
        )
      );

      // Check if all users were updated successfully
      if (updatedUsers.every((user) => user)) {
        return "Users updated successfully";
      } else {
        throw new Error("Failed to update one or more users");
      }
    },
  },
  User: {
    Class(user) {
      if (!user.classId) return null;
      return { __typename: "Classes", id: user.classId };
    },
    __resolveReference(object, { datasource }) {
      console.log("datasource", datasource);
      return Class.findById(object.id);
    },
  },
};

module.exports = userResolver;
