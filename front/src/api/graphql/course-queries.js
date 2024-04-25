import { gql } from "@apollo/client";

export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    getAllCourses {
      id
      name
      description
      teacherId
    }
  }
`;

export const GET_COURSES_BY_TEACHER_ID = gql`
  query GetCoursesByTeacherId($teacherId: ID!) {
    getCoursesByTeacherId(teacherId: $teacherId) {
      id
      name
      description
    }
  }
`;