const Course = require("../database/models/course");

const courseResolver = {
  Query: {
    getCourse: async (_, { id }) => {
      return await Course.findById(id);
    },
    getAllCourses: async () => {
      return await Course.find();
    },
  },
  Mutation: {
    createCourse: async (_, { course }) => {
      const newCourse = new Course(course);
      return await newCourse.save();
    },
    updateCourse: async (_, { id, course }) => {
      return await Course.findByIdAndUpdate(id, course, { new: true });
    },
  },
  Course: {
   async  __resolveReference(object) {
      console.log(object);
      return  await Course.findById(object.id);
    },
    Class(course) {
        console.log('test')
      return {
        __typename: "Class",
        id: course.classId,
      };
    },
    User(course) {
      // Si teacherId est un tableau
      if (Array.isArray(course.teacherId)) {
        return course.teacherId.map((id) => ({ __typename: "User", id }));
      }
      // Si teacherId est un seul ID
      else {
        return [{ __typename: "User", id: course.teacherId }];
      }
    },
  },
  Courses: {
    __resolveReference(object) {
      console.log(object);
      return Course.findById(object.id);
    }
  },
};

module.exports = courseResolver;
