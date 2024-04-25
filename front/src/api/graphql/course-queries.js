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
