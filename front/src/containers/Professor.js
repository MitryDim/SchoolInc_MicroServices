import React from "react";

const Professor = () => {
  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Professor Panel
      </h1>
      <div className="grid grid-cols-2 gap-6 mt-5">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>

          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold font-montserrat">
                  Name
                </th>
                <th className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold font-montserrat">
                  Code
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 font-montserrat text-center">
                  Course 1
                </td>
                <td className="py-3 px-4 font-montserrat text-center">123</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-montserrat text-center">
                  Course 2
                </td>
                <td className="py-3 px-4 font-montserrat text-center">456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Professor;
