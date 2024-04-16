import React from "react";
import NavbarButton from "../components/NavbarButton";
import * as MDIcons from "react-icons/md";
import * as IMIcons from "react-icons/im";

const Navbar = () => {
  const userRole = "admin"; // Replace this with the actual user role

  return (
    <div className="w-28 h-screen bg-[#673AB7] text-white flex flex-col justify-between">
      <div className="flex flex-col items-center">
        <div className="mt-5">
          <img className="w-24 h-auto" src="logo.png" alt="logo" />
        </div>
        <hr className="w-1/2 mt-5 mb-5 border-1 border-white" />
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
        {(userRole === "admin" || userRole === "professor") && (
          <div className="mt-5">
            <NavbarButton
              Tooltip={"Classes"}
              To={"classes"}
              Icon={MDIcons.MdOutlineSchool}
            />
          </div>
        )}
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
      </div>
      <div className="mb-5 flex flex-col items-center justify-end">
        <button
          onClick={() => alert("You have been logged out")}
          className="flex items-center text-white py-1 px-1 rounded hover:bg-white hover:text-[#673AB7] transition duration-300 ease-in-out font-montserrat mb-4"
        >
          <MDIcons.MdLogout size={20} className="mr-1" />
          <h4>Log Out</h4>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
