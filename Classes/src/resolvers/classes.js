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
    addCourseToClass: async (_, { classId, courseId }, { userAuth }) => {
      if (!userAuth) throw new Error("You are not authenticated");
      // Check if the user is authorized
      if (!userAuth.isAdmin && !userAuth.isProfessor) {
        throw new Error("Unauthorized");
      }
      const classObj = await Class.findById(classId);
      if (!classObj) {
        throw new Error(`Class with id ${classId} not found`);
      }
      console.log(courseId)
      const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { $addToSet: { coursesId: courseId } },
        { new: true }
      );
      if (!updatedClass) {
        throw new Error(`Class with id ${classId} not found`);
      }
      return updatedClass;
    },
  },
    Class: {
      async __resolveReference(object) {
        console.log("class", object);
        return await Class.findById(object.id);
      },
 Courses: async (classObj) => {
    // Get the courses data
    const courses = await Promise.all(
      classObj.coursesId.map((id) => {
        return {
          __typename: "Course",
          id: id,
        };
      })
    );  
    return courses;
  },
    },
};

module.exports = classResolver;
