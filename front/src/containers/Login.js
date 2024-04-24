import React, { useState } from "react";
import { useMutation, gql, useApolloClient } from "@apollo/client";
import { LOGIN_USER } from "../api/graphql/user-queries";

const Login = () => {
  const client = useApolloClient();
  console.log(client);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

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
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md px-8 py-12">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#673AB7] hover:bg-[#855dca] focus:ring-blue-500 focus:ring-opacity-50 text-center text-white text-sm font-medium rounded-lg shadow-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
