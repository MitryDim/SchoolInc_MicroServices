const Class = require("../database/models/class");

const classResolver = {
  Query: {
    getClass: async (_, { id }) => {
      return await Class.findById(id);
    },
    getAllClasses: async () => {
      return await Class.find();
    },
  },
  Mutation: {
    createClass: async (_, { classInput }) => {
      const newClass = new Class(classInput);
      return await newClass.save();
    },
    updateClass: async (_, { id, classInput }) => {
      return await Class.findByIdAndUpdate(id, classInput, { new: true });
    },
  },
  Class: {
    __resolveReference(object) {
      return Class.findById(object.id);
    },

  },
};

module.exports = classResolver;
