import { useApolloClient, gql } from "@apollo/client";

export function useUser() {
  const client = useApolloClient();

  const user = client.cache.readQuery({
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
  });
  return user;
}
