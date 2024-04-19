const Course = require("../database/models/course");

const courseResolver = {
  Query: {
    getCourse: async (_, { id }) => {
      return await Course.findById(id);
    },
    getAllClasses: async () => {
      return await Course.find();
    },
  },
  Mutation: {
    createCourse: async (_, { courseInput }) => {
      const newCourse = new Course(courseInput);
      return await newCourse.save();
    },
    updateCourse: async (_, { id, courseInput }) => {
      return await Course.findByIdAndUpdate(id, courseInput, { new: true });
    },
  },
  Course: {
    __resolveReference(object) {
      return Course.findById(object.id);
    },
  },
};

module.exports = courseResolver;
