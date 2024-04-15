import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";

const Dashboard = () => {
  const user = {
    firstname: "Johnny",
    lastname: "Deep",
    role: "S.Eng4 2016-2017",
    spe: "Web Development",
  };

  // State variables for modal visibility and user data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(user);

  // Function to handle opening the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform actions to update user data (e.g., make API call)
    console.log("User data updated:", userData);
    closeModal();
  };

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-6 mt-5">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            User Information
          </h2>
          <div className="flex items-center mb-4">
            <div className="avatar">
              <div className="w-24 h-auto rounded-full ring ring-[#673AB7] ring-offset-base-100 ring-offset-2">
                <img
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  alt="Avatar"
                />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold">
                {userData.firstname} {userData.lastname}
              </p>
              <p className="text-xs font-montserrat font-medium text-white bg-[#673AB7] py-1 px-1 rounded-lg">
                {userData.role}
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={openModal} // Call openModal function when clicked
                className="pl-2 text-[#673AB7] bg-[#ab96d8] rounded px-1 py-1 hover:text-white hover:bg-[#673AB7]"
              >
                <FaUserEdit size={25} />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 font-semibold">Specialization:</p>
            <p className="text-sm text-gray-500 bg-gray-200 rounded-md px-2 py-1 inline-block mt-1">
              {userData.spe}
            </p>
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
      {/* Modal component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Specialization</label>
                <input
                  type="text"
                  name="spe"
                  value={userData.spe}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={closeModal} // Call closeModal function when clicked
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
