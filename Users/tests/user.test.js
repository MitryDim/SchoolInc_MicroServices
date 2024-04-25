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
        firstname: "Admin",
        lastname: "User",
        email: "admin4@example.com",
        role: ["admin"],
        speciality: "d",
        password: "Test123456789*",
    },
    });

    console.log(res)
    assert(res.errors === undefined);
    assert(res.data.createUser.role.includes("admin"));
    adminToken = res.data.createUser.token;
  });

  it("should login the admin user", async () => {
    const LOGIN = gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          id
          firstname
          lastname
          role
          email
          token
        }
      }
    `;

    const res = await server.executeOperation({
      query: LOGIN,
      variables: {
        email: "admin@example.com",
        password: "password",
      },
    });

    assert(res.errors === undefined);
    assert(res.data.login.role.includes("admin"));
    adminToken = res.data.login.token;
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
      context: () => ({ userAuth: { token: adminToken, isAdmin: true } }),
    });

    assert(res.errors === undefined);
    // vérifiez les données ici
  });

  // autres tests ici
});
