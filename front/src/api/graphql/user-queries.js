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
      speciality
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $firstname: String!
    $lastname: String!
    $email: String!
    $role: String!
    $speciality: String!
  ) {
    createUser(
      input: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        role: $role
        speciality: $speciality
      }
    ) {
      firstname
      lastname
      email
      role
      speciality
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $username: String!
    $email: String!
    $age: Int!
  ) {
    updateUser(
      id: $id
      input: { username: $username, email: $email, age: $age }
    ) {
      id
      username
      email
      age
      createdAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($usersIds: [UserId!]!) {
    deleteUser(usersIds: $usersIds)
  }
`;