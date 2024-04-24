import React from "react";
import NavbarButton from "../components/NavbarButton";
import * as MDIcons from "react-icons/md";
import * as IMIcons from "react-icons/im";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { gql, useApolloClient } from "@apollo/client";
const Navbar = () => {
  const client = useApolloClient();
  const token = localStorage.getItem("token"); // Check for token in local storage

  try {
    const user = jwtDecode(token);

    if (user) {
      client.cache.writeQuery({
        query: gql`
          query GetUser {
            user {
              id
              firstname
              lastname
            }
          }
        `,
        data: {
          user,
        },
      });
    }
  } catch (e) {
    client.cache.reset();
    console.error("Failed to decode JWT:", e);
  }

  return (
    <div className="w-28 h-screen bg-[#673AB7] text-white flex flex-col justify-between">
      <div className="flex flex-col items-center">
        {/* Logo and separator */}
        <div className="mt-5">
          <img className="w-24 h-auto" src="logo.png" alt="logo" />
        </div>
        <hr className="w-1/2 mt-5 mb-5 border-1 border-white" />
        {token ? (
          <>
            <div className="mt-5">
              <NavbarButton
                Tooltip={"Dashboard"}
                To={"/"}
                Icon={MDIcons.MdSpaceDashboard}
              />
            </div>
            <div className="mt-5">
              <NavbarButton
                Tooltip={"Grades"}
                To={"grades"}
                Icon={IMIcons.ImStatsBars}
              />
            </div>
            <div className="mt-5">
              <NavbarButton
                Tooltip={"Tickets"}
                To={"tickets"}
                Icon={IMIcons.ImTicket}
              />
            </div>
            <div className="mt-5">
              <NavbarButton
                Tooltip={"Admin"}
                To={"admin"}
                Icon={MDIcons.MdAdminPanelSettings}
              />
            </div>
          </>
        ) : (
          <div className="mt-5">
            <NavbarButton
              Tooltip={"Login"}
              To={"login"}
              Icon={MDIcons.MdLogin}
            />
          </div>
        )}
      </div>
      <div className="mb-5 flex flex-col items-center justify-end">
        {/* Log out button only if token exists */}
        {token && (
          <Link
            to="/login"
            onClick={() => {
              localStorage.removeItem("token");
            }}
            className="flex items-center text-white py-1 px-1 rounded hover:bg-white hover:text-[#673AB7] transition duration-300 ease-in-out font-montserrat mb-4"
          >
            <MDIcons.MdLogout size={20} className="mr-1" />
            <h4>Log Out</h4>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
