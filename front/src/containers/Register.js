import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, gql, useApolloClient } from "@apollo/client";
import { CREATE_USER } from "../api/graphql/user-queries";

function Register() {
  const client = useApolloClient();
  const [errorMessage, setErrorMessage] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [speciality, setSpeciality] = useState("");

  const handleRegister = async () => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_USER,
        variables: { firstname, lastname, email, password, role, speciality },
      });

      console.log("data", data);
      const token = data?.createUser?.token;
      if (token) {
        // Stockez le token dans le local storage ou un cookie
        localStorage.setItem("token", token);
        window.location.href = "/";
      }
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md px-8 py-12">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-blue-500 focus:ring-opacity-50"
              type="text"
              placeholder="Enter your first name"
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-blue-500 focus:ring-opacity-50"
              type="text"
              placeholder="Enter your last name"
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-blue-500 focus:ring-opacity-50"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-blue-500 focus:ring-opacity-50"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speciality
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-0 focus:ring-blue-500 focus:ring-opacity-50"
              type="text"
              placeholder="Enter your speciality"
              onChange={(e) => setSpeciality(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2 px-4 bg-[#673AB7] hover:bg-[#855dca] focus:ring-blue-500 focus:ring-opacity-50 text-center text-white text-sm font-medium rounded-lg shadow-sm"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-[#673AB7] hover:text-[#855dca]">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
