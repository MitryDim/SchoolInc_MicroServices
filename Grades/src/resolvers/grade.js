const Grades = require("../database/models/grade");

const gradeResolver = {
  Query: {
    getGrade: async (_, { id }) => {
      return await Grades.findById(id);
    },
    getAllGrades: async (_, args, { userAuth }) => {
      if (!userAuth)
        throw new Error("You must be logged in to access this resource");

      if (!userAuth.isAdmin && !userAuth.isProfessor)
        throw new Error("You are not authorized to access this resource");

      return await Grades.find();
    },
    getAllGradesByUserId: async (_, { userId }, { userAuth }) => {
      let id = userId;
      if (!userAuth)
        throw new Error("You are not authorized to access this resource");

      if (id) {
        if (userAuth.id !== id && userAuth.isProfessor && userAuth.isAdmin)
          throw new Error("You are not authorized to access this resource");
      } else id = userAuth.id;

      return await Grades.find({ userId: id });
    },
    getAllGradesByCourseId: async (_, { courseId }, { userAuth }) => {
      if (!userAuth)
        throw new Error("You must be logged in to access this resource");

      if (userAuth.isProfessor && userAuth.isAdmin)
        throw new Error("You are not authorized to access this resource");
      return await Grades.find({ courseId: courseId });
    },

    getAllGradesByCourseIds: async (_, { courseIds }) => {
      if (!userAuth)
        throw new Error("You must be logged in to access this resource");

      if (userAuth.isProfessor && userAuth.isAdmin)
        throw new Error("You are not authorized to access this resource");

      return await Grades.find({ courseId: { $in: courseIds } });
    },

    getAllGradesByUserIdAndCourseId: async (_, { userId, courseId }) => {
      let id = userId;
      if (!userAuth)
        throw new Error("You are not authorized to access this resource");

      if (id) {
        if (userAuth.id !== id && (userAuth.isProfessor && userAuth.isAdmin))
          throw new Error("You are not authorized to access this resource");
      } else id = userAuth.id;
      return await Grades.find({ userId: id, courseId: courseId });
    },
  },
  Mutation: {
    createGrade: async (_, { grade }) => {
      const newGrade = new Grades(grade);
      return await newGrade.save();
    },
    updateGrade: async (_, { id, grade }) => {
      return await Grades.findByIdAndUpdate(id, grade, { new: true });
    },
    deleteGrade: async (_, { id }) => {
      return await Grades.findByIdAndDelete(id);
    },
  },
  Grade: {
    course: (gradeObj) => {
      return { __typename: "Course", id: gradeObj.courseId };
    },
    Class: (gradeObj) => {
      return { __typename: "Class", id: gradeObj.classId };
    },
    user: (gradeObj) => {
      console.log(gradeObj.userId);
      return { __typename: "User", id: gradeObj.userId };
    },
    grade: (gradeObj) => {
      console.log(gradeObj);
      return null;
    },
    __resolveReference: (reference, { dataSources }) => {
      console.log(reference, dataSources);
      if (reference.userId) {
        return dataSources.gradeAPI.getGradeByUserId(reference.userId);
      }
      if (reference.courseId) {
        return dataSources.gradeAPI.getGradeByCourseId(reference.courseId);
      }
    },
  }
};

module.exports = gradeResolver;
