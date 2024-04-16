// queries.js

import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      firstname
      lastname
      email
      role
      spe
      password
    }
  }
`;

// export const CREATE_USER = gql`
//   mutation CreateUser($username: String!, $email: String!, $age: Int!) {
//     createUser(input: { username: $username, email: $email, age: $age }) {
//       id
//       username
//       email
//       age
//       createdAt
//     }
//   }
// `;

// export const UPDATE_USER = gql`
//   mutation UpdateUser(
//     $id: ID!
//     $username: String!
//     $email: String!
//     $age: Int!
//   ) {
//     updateUser(
//       id: $id
//       input: { username: $username, email: $email, age: $age }
//     ) {
//       id
//       username
//       email
//       age
//       createdAt
//     }
//   }
// `;

// export const DELETE_USER = gql`
//   mutation DeleteUser($id: ID!) {
//     deleteUser(id: $id) {
//       id
//     }
//   }
// `;
