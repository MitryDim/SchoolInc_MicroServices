import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Grades from "./Grades";
import Classes from "./Classes";
import NotFound from "./NotFound";
import Tickets from "./Tickets";
import Admin from "./Admin";
import Login from "./Login";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div className="flex">
        <Navbar />
        <div className="flex-grow p-4 bg-slate-100">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            {/* Private routes */}
            {token ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/admin" element={<Admin />} />
              </>
            ) : (
              <Route path="/login" element={<Login />} />
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
