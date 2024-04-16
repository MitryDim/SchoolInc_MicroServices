import React from "react";
import { NavLink } from "react-router-dom";

const NavbarButton = (props) => {
  const Icon = props.Icon;

  return (
    <>
      <NavLink
        data-tip={props.Tooltip}
        to={props.To}
        className={({ isActive }) =>
          `flex items-center w-auto h-auto py-2 px-2 rounded-2xl transition duration-300 ease-in-out hover:text-[#673AB7] hover:bg-white ${
            isActive ? "text-[#673AB7] bg-white" : ""
          } tooltip tooltip-right tooltip-primary font-semibold font-montserrat`
        }
      >
        <Icon size={30} />
      </NavLink>
    </>
  );
};

export default NavbarButton;
