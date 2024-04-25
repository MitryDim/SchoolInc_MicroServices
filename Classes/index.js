const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { API_PORT } = require("./src/config");
const { classeSchema } = require("./src/schemas");
const { classeResolver } = require("./src/resolvers/index");
const { ValidateSignature } = require("./src/utils");

require("./src/database/mongoConnect").connect();

const { buildSubgraphSchema } = require("@apollo/subgraph");

const server = new ApolloServer({
  schema: buildSubgraphSchema([
    { typeDefs: classeSchema, resolvers: classeResolver },
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
