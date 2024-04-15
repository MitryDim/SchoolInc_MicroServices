import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";

const Admin = () => {
  const users = [
    {
      firstname: "Johnny",
      lastname: "Deep",
      role: "Student",
      classes: "S.Eng4",
      spe: "Web Development",
    },
    {
      firstname: "Mitry",
      lastname: "Dims",
      role: "Professor",
      classes: "S.Eng4",
      spe: "Web Development",
    },
  ];

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Admin
      </h1>
      <div className="grid grid-cols-2 gap-6 mt-5">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Users Lists</h2>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Favorite Color</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
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
                        <div className="font-bold">
                          {user.firstname} {user.lastname}
                        </div>
                      </div>
                    </td>
                    <td>{user.role}</td>
                    <td>{user.color}</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Job</th>
                  <th>Favorite Color</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="divide-y divide-gray-300">
            <li className="py-2">
              <p className="text-gray-700">New user registered</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </li>
            <li className="py-2">
              <p className="text-gray-700">Order received</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </li>
            <li className="py-2">
              <p className="text-gray-700">Product updated</p>
              <p className="text-sm text-gray-500">3 days ago</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Admin;
