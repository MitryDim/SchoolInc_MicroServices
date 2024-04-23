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

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      firstname
      lastname
      token
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
    $role: [String]!
    $speciality: String!
  ) {
    createUser(
      user: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        password: $password
        role: $role
        speciality: $speciality
      }
    ) {
      id
      firstname
      lastname
      token
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
      input: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        role: $role
        speciality: $speciality
      }
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
  mutation DeleteUser($usersIds: [UserId!]!) {
    deleteUser(usersIds: $usersIds)
  }
`;
