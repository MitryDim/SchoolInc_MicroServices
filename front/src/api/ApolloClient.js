import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { jwtDecode } from "jwt-decode";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/",
});

// Utilisez setContext pour créer un lien qui ajoute le token d'authentification à l'en-tête Authorization de chaque requête
const authLink = setContext((_, { headers }) => {
  // Obtenez le token d'authentification de localStorage si possible
  const token = localStorage.getItem("token");
  let context = {};
  console.log("token", token);
  if (token) {
    context.authorization = `Bearer ${token}`;

    loadDevMessages();
    loadErrorMessages();

    try {
      const user = jwtDecode(token);
      context.user = user;
      // Écrire les données de l'utilisateur dans le cache
      client.cache.writeQuery({
        query: gql`
          query GetUser {
            user {
              id
              firstname
              lastname
              email
              role
              speciality
            }
          }
        `,
        data: {
          user,
        },
      });
    } catch (e) {
      client.cache.reset();
      console.error("Failed to decode JWT:", e);
    }
  } else {
    client.cache.reset();
  }

  return {
    headers: {
      ...headers,
      ...context,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
