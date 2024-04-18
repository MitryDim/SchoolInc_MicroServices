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
    createClass: async (_, { class }) => {
      const newClass = new Class(class);
      return await newClass.save();
    },
    updateClass: async (_, { id, class }) => {
      return await Class.findByIdAndUpdate(id, class, { new: true });
    },
  },
  Class: {
    __resolveReference(class) {
      return Class.findById(class.id);
    },
  },
};

module.exports = classResolver;