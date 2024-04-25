import { gql } from "@apollo/client";

// export const CREATE_GRADE = gql`
//   mutation CreateGrade {
//     createGrade(
//       grade: {
//         value: 15
//         courseId: "66237918476f89dc895b5aeb"
//         userId: "6622541f5cc63958ab7c565f"
//       }
//     ) {
//       id
//       value
//     }
//   }
// `;

export const GET_ALL_GRADES_BY_USER = gql`
  query GetAllGradesByUserId($userId: ID!) {
    getAllGradesByUserId(userId: $userId) {
      id
      value
      course {id, name}
    }
  }
`;


export const GET_ALL_GRADES_BY_COURSE_ID = gql`
  query GetAllGradesByCourseId($courseId: ID!) {
    getAllGradesByCourseId(courseId: $courseId) {
      id
      value
      course {
        id
        name
        description
        teacherId
      }
      user {
        id
        firstname
        lastname
        email
        role
        speciality
        classId
      }
    }
  }
`;

export const GET_ALL_GRADES = gql`
  query GetAllGrades {
    getAllGrades {
      id
      value
      user {
        id
        firstname
        lastname
        email
        role
        speciality
        classId
        Class {
          id
          name
          description
          coursesId
          Courses {
            id
            name
            description
            teacherId
          }
        }
      }
    }
  }
`;

export const UPDATE_GRADE = gql`
  mutation UpdateGrade($id: ID!, $grade: GradeInput) {
    updateGrade(id: $id, grade: $grade) {
      id
      value
      course {
        id
        name
      }
      user {
        id
        firstname
        lastname
      }
    }
  }
`;

export const DELETE_GRADE = gql`
  mutation DeleteGrade($id: ID!) {
    deleteGrade(id: $id) {
      id
    }
  }
`;