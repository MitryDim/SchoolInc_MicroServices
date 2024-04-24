const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { API_PORT } = require("./src/config");
const { userSchema } = require("./src/schemas");
const { userResolver } = require("./src/resolvers/index");
const { ValidateSignature } = require("./src/utils");

require("./src/database/mongoConnect").connect();

const { buildSubgraphSchema } = require("@apollo/subgraph");

const server = new ApolloServer({
  schema: buildSubgraphSchema([
    { typeDefs: userSchema, resolvers: userResolver },
  ]),
});

async function StartServer() {
  const { url } = await startStandaloneServer(server, {
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
    listen: { port: API_PORT },
  });
  console.log(`🚀  Server ready at ${url}`);
}

StartServer();
