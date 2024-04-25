const Users = require("../database/models/user");
const utils = require("../utils");
const userResolver = {
  Query: {
    getUserById: async (_, { id }, { userAuth }) => {
      if (!userAuth) throw new Error("You are not authenticated");
      if (id) {
        if (!userAuth.isAdmin && !userAuth.isProfessor && userAuth.id !== id)
          throw new Error("Unauthorized");
      } else id = userAuth.id;

      return await Users.findById(id);
    },

    searchByName: async (_, { name }, { userAuth }) => {
      if (!userAuth) throw new Error("You are not authenticated");

      const user = await Users.find({ firstname: name });
      if (!user) {
        throw new Error("User not found");
      }

      if (
        !userAuth.isAdmin &&
        !userAuth.isProfessor &&
        userAuth.id !== user.id
      ) {
        throw new Error("Unauthorized");
      }

      return user;
    },
    getAllUsers: async (_, args, { userAuth }) => {
      if (!userAuth) {
        throw new Error("You are not authenticated");
      }
      console.log("userAuth", userAuth);
      if (!userAuth.isAdmin && !userAuth.isProfessor) {
        throw new Error("Unauthorized");
      }

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
    addToClass: async (_, { userId, classId }, { userAuth }) => {
      if (!userAuth) throw new Error("You are not authenticated");
      // Check if the user is authorized
      if (
        !userAuth.isAdmin &&
        !userAuth.isProfessor &&
        userAuth.id !== userId
      ) {
        throw new Error("Unauthorized");
      }
      const user = await Users.findByIdAndUpdate(
        userId,
        { classId: classId },
        { new: true }
      );
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }
      return user;
    },
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
        console.log("args", args);
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
    updateUser: async (_, args, { userAuth }) => {
      if (!userAuth) {
        throw new Error("Unauthorized");
      }

      const { id, user } = args;

      if (!userAuth.isAdmin && !userAuth.isProfessor && id !== userAuth.id) {
        throw new Error("Unauthorized");
      }

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
    deleteUser: async (_, { usersIds }, { userAuth }) => {
      if (!userAuth) throw new Error("you are not authenticated");
      // Check if the user is authorized
      if (
        !userAuth.isAdmin &&
        !userAuth.isProfessor &&
        userAuth.id !== usersIds[0]?.id
      ) {
        throw new Error("Unauthorized");
      }
      const deleteUsers = await Promise.all(
        usersIds.map(async ({ id }) => {
          const user = await Users.findById(id);
          if (user) {
            if (user.classId)
              throw new Error(`user is in a class, can't delete ${user.id}`);
            try {
              await Users.findByIdAndDelete(id);
              return `User with id ${id} was deleted`;
            } catch (error) {
              throw new Error(
                `Failed to delete user with id ${id}: ${error.message}`
              );
            }
          } else {
            throw new Error(`User with id ${id} not found`);
          }
        })
      );

      // Check if all users were deleted successfully
      if (deleteUsers.every((msg) => msg.includes("was deleted"))) {
        return "All users were deleted successfully";
      } else {
        return `Error during deletion: ${deleteUsers.join(", ")}`;
      }
    },
  },
  User: {
    Class(user) {
      console.log("Class");
      if (!user.classId) return null;
      return { __typename: "Classes", id: user.classId };
    },
    grades: (user) => {
      console.log("Grades");
      return { __typename: "Grade", userId: user.id };
    },
    __resolveReference(object, { datasources }) {
      return Users.findById(object.id);
    },
  },
};

module.exports = userResolver;
