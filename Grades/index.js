const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { API_PORT } = require("./src/config");
const { gradeSchema } = require("./src/schemas");
const { gradeResolver } = require("./src/resolvers/index");
const { ValidateSignature } = require("./src/utils");
const GradeAPI = require("./src/API/gradeAPI");

const mongoose = require("./src/database/mongoConnect");
const Grade = require("./src/database/models/grade"); // Assurez-vous que le chemin est correct

const { buildSubgraphSchema } = require("@apollo/subgraph");

async function StartServer() {
  await mongoose.connect();

  const gradeAPI = new GradeAPI({ modelOrCollection: Grade });

  const server = new ApolloServer({
    schema: buildSubgraphSchema([
      { typeDefs: gradeSchema, resolvers: gradeResolver },
    ]),
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const userIsAuthorized = ValidateSignature(token);

      return { userIsAuthorized, dataSources: { gradeAPI } };
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: API_PORT },
  });
  console.log(`🚀  Server ready at ${url}`);
}

StartServer();
