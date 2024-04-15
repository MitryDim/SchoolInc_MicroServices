import { useState } from "react";

const Grades = () => {
  const [grades, setGrades] = useState([
    { id: 1, course: "Mathematics", grade: "18/20" },
    { id: 2, course: "Science", grade: "15/20" },
    // Add more fake data here
  ]);

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Grades
      </h1>
      <div className="bg-white p-6 rounded shadow-md mt-5">
        <h2 className="text-xl font-semibold mb-4">List of Grades</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold font-montserrat">
                Course
              </th>
              <th className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold font-montserrat">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td className="py-2 px-4 font-montserrat">{grade.course}</td>
                <td className="py-2 px-4 flex justify-center font-montserrat">{grade.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;
