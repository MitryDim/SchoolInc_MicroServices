import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import * as CIIcons from "react-icons/ci";
import * as MDIcons from "react-icons/md";
import * as FAIcons from "react-icons/fa";

import { generatePassword } from "../functions/generatePassword";

import {
  GET_ALL_USERS,
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from "../api/graphql/user-queries";
import { useUser } from "../context/userContext";

const Admin = () => {
  const { user } = useUser();

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_ALL_USERS);

  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });

  const users = usersData?.getAllUsers || [];

  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userData, setUserData] = useState({});

  const handleRegeneratePassword = () => {
    const newPassword = generatePassword();
    setUserData((prevUserData) => ({
      ...prevUserData,
      password: newPassword,
    }));
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setSelectedUsers(isChecked ? users.map((user) => user.id) : []);
  };

  const handleCheckboxChange = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  useEffect(() => {
    // Vérifier si tous les utilisateurs sont sélectionnés
    const allSelected = selectedUsers.length === users.length;
    setSelectAll(allSelected);
  }, [selectedUsers, users]);

  const handleConfirmDelete = async () => {
    console.log(
      "Suppression des utilisateurs:",
      selectedUsers.map((id) => ({ id: id }))
    );
    try {
      await deleteUser({
        variables: { usersIds: selectedUsers.map((id) => ({ id: id })) },
      });
      console.log("Utilisateurs supprimés avec succès", selectedUsers);
    } catch (error) {
      console.error("Erreur lors de la suppression des utilisateurs:", error);
    }
    document.getElementById("deleteModal").close();
  };

  const handleUpdateModalOpen = (user) => {
    document.getElementById("updateModal").showModal();
    setUserData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      speciality: user.speciality,
      password: "",
    });
  };

  const handleDeleteModalOpen = () => {
    document.getElementById("deleteModal").showModal();
  };

  const handleCreateModalOpen = () => {
    setUserData({
      firstname: "",
      lastname: "",
      email: "",
      role: "",
      speciality: "",
      password: "",
    });
    document.getElementById("createModal").showModal();
  };

  const handleConfirmUpdate = () => {
    console.log("Mise à jour de l'utilisateur:", userData);
  };

  const handleConfirmCreate = async () => {
    try {
      await createUser({
        variables: {
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          role: userData.role,
          speciality: userData.speciality,
          password: userData.password,
        },
      });
      console.log("Utilisateur créé avec succès", userData);
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
    }
    setUserData({
      firstname: "",
      lastname: "",
      email: "",
      role: "",
      speciality: "",
      password: "",
    });

    document.getElementById("createModal").close();
  };

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Admin ({user?.firstname})
      </h1>
      <div className="grid grid-cols-2 gap-6 mt-5">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Users Lists</h2>
          <div className="overflow-x-auto">
            {usersLoading ? (
              <p>Loading...</p>
            ) : usersError ? (
              <p>Error :( {usersError.message}</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="checkbox border-[#673AB7] checked:border-[#673AB7] [--chkbg:#673AB7] [--chkfg:white]"
                        onChange={handleSelectAll}
                        checked={selectAll}
                      />
                    </th>
                    <th className="text-[#673AB7]">Name</th>
                    <th className="text-[#673AB7]">Email</th>
                    <th className="text-[#673AB7]">Role</th>
                    <th className="text-[#673AB7]">Speciality</th>
                    <th>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={handleCreateModalOpen}>
                          <FAIcons.FaUserPlus
                            size={20}
                            className="text-[#673AB7] hover:text-[#8266b3]"
                          />
                        </button>
                        {selectedUsers.length > 0 && (
                          <button type="button" onClick={handleDeleteModalOpen}>
                            <CIIcons.CiTrash
                              size={20}
                              className="text-[#673AB7] hover:text-red-600"
                            />
                          </button>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <th>
                        <input
                          type="checkbox"
                          className="checkbox border-[#673AB7] checked:border-[#673AB7] [--chkbg:#673AB7] [--chkfg:white]"
                          onChange={() => handleCheckboxChange(user.id)}
                          checked={selectedUsers.includes(user.id)}
                        />
                      </th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src={`https://robohash.org/${user.firstname}.png`}
                                alt="Avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div className="font-bold text-[#673AB7]">
                            {user.firstname} {user.lastname}
                          </div>
                        </div>
                      </td>
                      <td className="text-[#673AB7]">{user.email}</td>
                      <td className="text-[#673AB7]">{user.role}</td>
                      <td className="text-[#673AB7]">{user.speciality}</td>
                      <th>
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateModalOpen(user);
                          }}
                          className="pl-2 text-[#673AB7] bg-[#ab96d8] rounded px-1 py-1 hover:text-white hover:bg-[#673AB7]"
                        >
                          <FAIcons.FaUserEdit size={20} />
                        </button>
                      </th>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <th className="text-[#673AB7]">Name</th>
                    <th className="text-[#673AB7]">Email</th>
                    <th className="text-[#673AB7]">Role</th>
                    <th className="text-[#673AB7]">Speciality</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
        <dialog id="deleteModal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Confirmation</h3>
            <p className="py-4">Are you sure you want to delete this user?</p>
            <div className="modal-action">
              <button
                className="btn mr-2 border-red-600 text-red-600"
                onClick={handleConfirmDelete}
              >
                Yes, delete
              </button>
              <button
                className="btn"
                onClick={() => document.getElementById("deleteModal").close()}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
        <dialog id="createModal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create new user</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmCreate(userData);
              }}
            >
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    First Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    placeholder="John"
                    value={userData.firstname}
                    onChange={(e) =>
                      setUserData({ ...userData, firstname: e.target.value })
                    }
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Last Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    placeholder="Doe"
                    value={userData.lastname}
                    onChange={(e) =>
                      setUserData({ ...userData, lastname: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Email
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    placeholder="john@doe.com"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      value={userData.role}
                      onChange={(e) =>
                        setUserData({ ...userData, role: e.target.value })
                      }
                    >
                      <option>student</option>
                      <option>professor</option>
                      <option>admin</option>
                    </select>
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 mt-4">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Speciality
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    placeholder="Developer"
                    value={userData.speciality}
                    onChange={(e) =>
                      setUserData({ ...userData, speciality: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
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
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn border-green-600 text-green-600"
                >
                  Create
                </button>
                <button
                  className="btn"
                  onClick={() => document.getElementById("createModal").close()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Admin;
