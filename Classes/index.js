const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { API_PORT } = require('./src/config')
const { classeSchema } = require("./src/schemas");
const { classeResolver } = require("./src/resolvers/index");
const { ValidateSignature } = require("./src/utils");

require("./src/database/mongoConnect").connect();

const { buildSubgraphSchema } = require('@apollo/subgraph');




const server = new ApolloServer({
  schema: buildSubgraphSchema([
    { typeDefs: classeSchema, resolvers: classeResolver },
  ]),
  context: async ({ req }) => {
    // obtenez le token d'autorisation de l'en-tête de la requête    const token = req.headers.authorization || "";
    const token = req.headers.authorization || "";
    // vérifiez si le token est valide
    const userIsAuthorized = ValidateSignature(token);

    // passez userIsAuthorized au contexte
    return { userIsAuthorized };
  },
});

async function StartServer() {
  const { url } = await startStandaloneServer(server,{listen: {port: API_PORT}});
  console.log(`🚀  Server ready at ${url}`);
}

StartServer();
