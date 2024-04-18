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
    $firstname: String!
    $lastname: String!
    $email: String!
    $role: String!
    $speciality: String!
  ) {
    updateUser(
      id: $id
      input: { firstname: $firstname, lastname: $lastname, email: $email, role: $role, speciality: $speciality}
    ) {
      id
      firstname
      lastname
      email
      role
      speciality
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($usersIds: [ID!]!) {
    deleteUser(usersIds: $usersIds)
  }
`;