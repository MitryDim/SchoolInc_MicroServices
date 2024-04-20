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
    createClass: async (_, args) => {
      console.log(args);
      const classInput = args.class;
      const newClass = new Class(classInput);
      return await newClass.save();
    },
    updateClass: async (_, { id, classInput }) => {
      return await Class.findByIdAndUpdate(id, classInput, { new: true });
    },
  },
  Class: {
    __resolveReference(object, { datasource }) {
      console.log("datasource", datasource);
      return Class.findById(object.id);
    },
    Courses(classObj) {
      console.log('test',classObj);
      return classObj.coursesId.map((id) => ({ __typename: "Course", id: id }));
    },
  },
};

module.exports = classResolver;
