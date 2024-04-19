const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "Classes", url: "http://localhost:4002/" },
      { name: "User", url: "http://localhost:4001/graphql" },
    ],
  }),
});

const server = new ApolloServer({ gateway });

async function StartServer() {
  // Note the top-level await!
  const { url } = await startStandaloneServer(server);
  console.log(`🚀  Server ready at ${url}`);
}

StartServer();