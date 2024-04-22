const Grades = require("../database/models/grade");
const gradeResolver = {
  Query: {
    getGrade: async (_, { id }) => {
      return await Grades.findById(id);
    },
    getAllGrades: async () => {
      return await Grades.find();
    },
    getAllGradesByUserId: async (_, { userId }) => {
      return await Grades.find({ userId: userId });
    },
    getAllGradesByCourseId: async (_, { courseId }) => {
      return await Grades.find({ courseId: courseId });
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
  },
  Grade: {
    course: (gradeObj) => {
      
      return { __typename: "Course", id: gradeObj.courseId };
    },
    Class: (gradeObj) => {
      console.log("Class")
      return { __typename: "Class", id: gradeObj.classId };
    },
    user: (gradeObj) => {
      return { __typename: "User", id: gradeObj.userId };
    },
  },
  User: {
    Class: (gradeObj) => {
      console.log("Class");
      return { __typename: "Class", id: gradeObj.classId };
    }
  }
};

module.exports = gradeResolver;
