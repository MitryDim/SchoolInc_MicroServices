import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import * as CIIcons from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";

import { GET_ALL_USERS, DELETE_USER } from "../api/graphql/user-queries";

const Admin = () => {
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_ALL_USERS);
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });

  const users = userData?.getAllUsers || [];

  const [selectAll, setSelectAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

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

  const handleDeleteModalOpen = () => {
    document.getElementById("deleteModal").showModal();
  };

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

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Admin
      </h1>{" "}
      <div className="grid grid-cols-2 gap-6 mt-5">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Users Lists</h2>
          <div className="overflow-x-auto">
            {userLoading ? (
              <p>Loading...</p>
            ) : userError ? (
              <p>Error :( {userError.message}</p>
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
                      {selectedUsers.length > 0 && (
                        <button onClick={handleDeleteModalOpen}>
                          <CIIcons.CiTrash
                            size={20}
                            className="text-[#673AB7] hover:text-red-600"
                          />
                        </button>
                      )}
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
                          // Call openModal function when clicked
                          className="pl-2 text-[#673AB7] bg-[#ab96d8] rounded px-1 py-1 hover:text-white hover:bg-[#673AB7]"
                        >
                          <FaUserEdit Edit size={20} />
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
            <h3 className="font-bold text-lg">Confirmation de suppression</h3>
            <p className="py-4">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </p>
            <div className="modal-action">
              <button
                className="btn mr-2 border-red-600 text-red-600"
                onClick={handleConfirmDelete}
              >
                Oui, supprimer
              </button>
              <button
                className="btn"
                onClick={() => document.getElementById("deleteModal").close()}
              >
                Annuler
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Admin;
