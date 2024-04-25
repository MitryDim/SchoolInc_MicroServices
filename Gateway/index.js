const { ApolloServer } = require("@apollo/server");
const { ApolloGateway, RemoteGraphQLDataSource,IntrospectAndCompose } = require("@apollo/gateway");
const { startStandaloneServer } = require("@apollo/server/standalone");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // Add the user's auth token to the headers
    request.http.headers.set('authorization', context.token);
  }
}

const gateway = new ApolloGateway({
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "Grade", url: "http://localhost:4004/" },
      { name: "Courses", url: "http://localhost:4003/" },
      { name: "Classes", url: "http://localhost:4002/" },
      { name: "User", url: "http://localhost:4001/" },
    ],
  }),
  serviceHealthCheck: true,
});

const server = new ApolloServer({ 
  gateway,
});

async function StartServer() {
   const { url } = await startStandaloneServer(server, {
     listen: 4000,
     context: ({ req }) => {
       // Get the user token from the headers
       const token = req.headers.authorization || "";
       // Return the token in the context
       return { token };
     },
   });

  console.log(`🚀  Server ready at ${url}`);
}

StartServer();