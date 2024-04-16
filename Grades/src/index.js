const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { API_PORT } = require('./src/config')
const { userSchema } = require("./src/schemas");
const { userResolver } = require("./src/resolvers/index");
const { ValidateSignature } = require("./src/utils");
require("./src/database/mongoConnect").connect();


const server = new ApolloServer({
  typeDefs: userSchema,
  resolvers: userResolver,
  
});

async function StartServer() {
  const { url } = await startStandaloneServer(server,  { port: API_PORT,context: async ({ req }) => {
    console.log("req", req);
    // obtenez le token d'autorisation de l'en-tête de la requête
    const token = req.headers.authorization || "";

    // vérifiez si le token est valide
    const userIsAuthorized = ValidateSignature(token);

    // passez userIsAuthorized au contexte
    return { userIsAuthorized };
  }});
  console.log(`🚀 Server ready at ${url}`);
}

StartServer();
