import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useUser } from "../context/userContext";
import * as MDIcons from "react-icons/md";
import * as FAIcons from "react-icons/fa";
import { generatePassword } from "../functions/generatePassword";
import { UPDATE_USER, GET_USER_BY_ID } from "../api/graphql/user-queries";

const Dashboard = () => {
  const { user } = useUser();
  const isAdmin = user?.role.includes("admin");
  const [userData, setUserData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    speciality: user?.speciality || "",
    password: "",
  });
  const [updateUser] = useMutation(UPDATE_USER);

  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id: user.id },
  });

  const userInfo = data?.getUserById;

  console.log("User Info:", userInfo);

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(userData);

      await updateUser({ variables: { id: user.id, user: userData } });
      document.getElementById("updateModal").close();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleRegeneratePassword = () => {
    const newPassword = generatePassword();
    setUserData((prevUserData) => ({
      ...prevUserData,
      password: newPassword,
    }));
  };

  const [passwordVisible, setPasswordVisible] = useState(true);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

    const [sortOrder, setSortOrder] = useState("asc");

    const handleSortClick = () => {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-6 mt-5">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="flex items-center mb-4">
            <div className="avatar">
              <div className="w-24 h-auto rounded-full ring ring-[#673AB7] ring-offset-base-100 ring-offset-2">
                <img
                  src={`https://robohash.org/${user?.firstname}.png`}
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-xs w-auto font-montserrat font-medium text-white bg-[#673AB7] py-1 px-1 rounded-lg">
                {user?.role}
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() =>
                  document.getElementById("updateModal").showModal()
                }
                className="pl-2 text-[#673AB7] bg-[#ab96d8] rounded px-1 py-1 hover:text-white hover:bg-[#673AB7]"
              >
                <FaUserEdit size={25} />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 font-semibold">Specialization:</p>
            <p className="text-sm text-gray-500 bg-gray-200 rounded-md px-2 py-1 inline-block mt-1">
              {user?.speciality}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow-md mt-5">
        <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userInfo && userInfo.Class ? (
            <div key={userInfo.Class.id}>
              <h3>{userInfo.Class.name}</h3>
              <p>Description: {userInfo.Class.description}</p>
            </div>
          ) : (
            <p>No classes found</p>
          )}
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow-md mt-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
          <button onClick={handleSortClick}>
            Sort {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userInfo && userInfo.Class && userInfo.Class.Courses.length > 0 ? (
            [...userInfo.Class.Courses]
              .sort((a, b) =>
                sortOrder === "asc"
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name)
              )
              .map((course) => (
                <div
                  key={course.id}
                  className="w-40 border rounded-md overflow-hidden"
                >
                  <img
                    src={`https://source.unsplash.com/random/400x250/?${course.name}`}
                    alt={course.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-center">
                      {course.name}
                    </h3>
                  </div>
                </div>
              ))
          ) : (
            <p>No courses found</p>
          )}
        </div>
      </div>

      <dialog id="updateModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update {user.firstname}</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  First Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Last Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Email
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Speciality
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  name="speciality"
                  value={userData.speciality}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full px-3 relative">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Password
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 pr-10 pl-10"
                  type={passwordVisible ? "text" : "password"}
                  value={userData.password}
                />
                <button type="button" onClick={togglePasswordVisibility}>
                  {passwordVisible ? (
                    <FAIcons.FaEyeSlash
                      size={17}
                      className="opacity-60 absolute left-6 top-10"
                    />
                  ) : (
                    <FAIcons.FaEye
                      size={17}
                      className="opacity-60 absolute left-6 top-10"
                    />
                  )}
                </button>
                <button type="button" onClick={handleRegeneratePassword}>
                  <MDIcons.MdLoop
                    size={20}
                    className="opacity-60 absolute right-6 top-9"
                  />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              {isAdmin && (
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Role
                  </label>
                  <select
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    name="role"
                    value={userData.role}
                    onChange={handleInputChange}
                  >
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-action">
              <button
                type="submit"
                className="btn border-green-600 text-green-600"
              >
                Update
              </button>
              <button
                className="btn"
                onClick={() => document.getElementById("updateModal").close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Dashboard;
