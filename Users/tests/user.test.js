const { MONGODB_URI } = require("../src/config");
const { ApolloServer } = require("@apollo/server");
const { userSchema } = require("../src/schemas");
const { userResolver } = require("../src/resolvers/index");
const { ValidateSignature } = require("../src/utils");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");
const assert = require("assert");
const mongoose = require("../src/database/mongoConnect");

const server = new ApolloServer({
  schema: buildSubgraphSchema([
    { typeDefs: userSchema, resolvers: userResolver },
  ]),
  context: async ({ req }) => {
    console.log("--------REQQQQ-----------", req);
    const token = req.headers.authorization || "";
    const user = await ValidateSignature(token);
    const userAuth = {
      ...user,
      isAdmin: user?.role?.includes("admin"),
      isProfessor: user?.role?.includes("professor"),
    };

    return { userAuth };
  },
});

describe("User Resolvers", () => {
  beforeAll(async function () {
    // Connect to the database
    await mongoose.connect();
  });

  let adminToken;

  const user = {
    firstname: "Admin",
    lastname: "User",
    email: "admin22@example.com",
    role: ["admin"],
    speciality: "d",
    password: "Test123456789*",
  };

  it("should create a new user with admin role", async () => {
    const CREATE_USER = gql`
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

    const res = await server.executeOperation({
      query: CREATE_USER,
      variables: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        speciality: user.speciality,
        password: user.password,
      },
    });

    const response = res?.body?.singleResult;
    assert(response.errors === undefined);
    assert(response.data.createUser?.id !== null);
    user.id = response.data.createUser?.id;
    adminToken = response.data?.createUser?.token;
  });

  it("should login the admin user", async () => {
    const LOGIN = gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          id
          firstname
          lastname
          token
        }
      }
    `;

    const res = await server.executeOperation({
      query: LOGIN,
      variables: {
        email: user.email,
        password: user.password,
      },
    });

    const response = res?.body?.singleResult;
    assert(response.errors === undefined);
    assert(response.data.login.id !== null);
    adminToken = response.data.login.token;
  });

  it("should get all users", async () => {
    const GET_ALL_USERS = gql`
      query GetAllUsers {
        getAllUsers {
          id
          firstname
          lastname
          role
          email
        }
      }
    `;

    const res = await server.executeOperation({
      query: GET_ALL_USERS,
      context: () => ({
        req: {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        },
      }),
    });

    assert(res.errors === undefined);
  });

  it("should get a user by ID", async () => {
    const GET_USER_BY_ID = gql`
      query GetUserById($id: ID!) {
        getUserById(id: $id) {
          id
          firstname
          lastname
          email
        }
      }
    `;

    const res = await server.executeOperation({
      query: GET_USER_BY_ID,
      variables: { id: user.id }
    },
    {req: {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        }});

    const response = res?.body?.singleResult;
    console.log(
      "--------------- GET_USER_BY_ID",
      JSON.stringify(res?.body?.singleResult.errors),
      user.id,
      adminToken
    );
    assert(response.errors === undefined);
    assert(response.data.getUserById.id !== null);
  });

  it("should update a user", async () => {
    const UPDATE_USER = gql`
      mutation UpdateUser($id: String!, $user: UserInput!) {
        updateUser(id: $id, user: $user) {
          id
          firstname
          lastname
          email
        }
      }
    `;

    const updatedUser = {
      firstname: "Updated",
      lastname: "User",
      email: "updated@example.com",
      password: "Updated123456789*",
      role: ["admin"],
      speciality: "d",
      classId: "someClassId",
    };

    const res = await server.executeOperation(
      { query: UPDATE_USER },
      {
        req: {
          headers: {
            authorization: `Bearer ${adminToken}`,
          },
        },
      },
      {
        variables: {
          id: user.id,
          user: updatedUser,
        },
      }
    );

    const response = res?.body?.singleResult;
    assert(response.errors === undefined);
    assert(response.data.updateUser.id === user.id);
    assert(response.data.updateUser.firstname === updatedUser.firstname);
    assert(response.data.updateUser.lastname === updatedUser.lastname);
    assert(response.data.updateUser.email === updatedUser.email);
  });

  
});
