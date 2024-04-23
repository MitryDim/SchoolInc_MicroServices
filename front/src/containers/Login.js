import React, { useState } from "react";
import { useApolloClient, gql } from "@apollo/client";
import { LOGIN_USER } from "../api/graphql/user-queries";

const Login = () => {
  const client = useApolloClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await client.mutate({
        mutation: LOGIN_USER,
        variables: { email, password },
      });
      const token = data?.login?.token;
      if (token) {
        // Stockez le token dans le local storage ou un cookie
        localStorage.setItem("token", token);
        // Redirigez l'utilisateur vers une autre page après connexion
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div>
          <label>Username</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
