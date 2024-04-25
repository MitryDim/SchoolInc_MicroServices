import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Grades from "./Grades";
import Classes from "./Classes";
import NotFound from "./NotFound";
import Tickets from "./Tickets";
import Admin from "./Admin";
import Login from "./Login";
import Register from "./Register";
import { jwtDecode } from "jwt-decode";

function App() {
  const token = localStorage.getItem("token"); // Check for token in local storage

  let user = null;
  if (token) {
    user = jwtDecode(token);
  }

  return (
    <Router>
      <div className="flex">
        <Navbar />
        <div className="flex-grow p-4 bg-slate-100">
          <Routes>
            {user ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/admin" element={<Admin />} />
              </>
            ) : (
              <>
                <Route index element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
