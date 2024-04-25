import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { GET_COURSES_BY_TEACHER_ID } from "../api/graphql/course-queries";
import { GET_ALL_GRADES_BY_COURSE_ID } from "../api/graphql/grade-queries";
import { useQuery } from "@apollo/client";

const fakeClasses = [
  {
    id: 1,
    name: "Class 1",
    description: "Description of Class 1",
    students: ["John", "Alice", "Bob"],
    imageUrl: "https://source.unsplash.com/random/800x400/?class1",
  },
  {
    id: 2,
    name: "Class 2",
    description: "Description of Class 2",
    students: ["Emma", "Jack", "Sophia"],
    imageUrl: "https://source.unsplash.com/random/800x400/?class2",
  },
];

const Professor = () => {
  // State to manage the selected class/course and its students
  const [selectedItem, setSelectedItem] = useState(null);

  const { user } = useUser();

  const { data, loading, error } = useQuery(GET_COURSES_BY_TEACHER_ID, {
    variables: { teacherId: user.id },
    skip: !user,
  });

  console.log(selectedItem?.id);

  const {
    data: gradesData,
    loading: gradesLoading,
    error: gradesError,
  } = useQuery(GET_ALL_GRADES_BY_COURSE_ID, {
    variables: { courseId: selectedItem?.id },
    skip: !selectedItem,
  });

  console.log(gradesData, gradesLoading, gradesError);

  // Check if data is loading or if there's an error
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract courses and classes from the data
  const courses = data.getCoursesByTeacherId;

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Professor Panel
      </h1>
      {/* Display classes as cards */}
      <div className="bg-white p-6 rounded shadow-md mt-5">
        <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {fakeClasses.map((classe) => (
            <div
              key={classe.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transform transition duration-300 ease-in-out hover:scale-105 cursor-pointer"
              onClick={() => setSelectedItem(classe)}
            >
              <img
                src={classe.imageUrl}
                alt={classe.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg text-center font-semibold text-gray-800 mb-2">
                  {classe.name}
                </h3>
                <p className="text-sm text-center text-gray-600">
                  {classe.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Display courses as cards */}
      <div className="bg-white p-6 rounded shadow-md mt-5">
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transform transition duration-300 ease-in-out hover:scale-105 cursor-pointer"
              onClick={() => setSelectedItem(course)}
            >
              <img
                src={`https://source.unsplash.com/random/800x400/?${course.name}`}
                alt={course.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg text-center font-semibold text-gray-800 mb-2">
                  {course.name}
                </h3>
                <p className="text-sm text-center text-gray-600">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Display students for the selected class/course */}
      {selectedItem && (
        <div className="bg-white p-6 rounded shadow-md mt-5">
          <h2 className="text-xl font-semibold mb-4">
            Grades in {selectedItem.name}
          </h2>
          {gradesData && (
            <table className="table">
              <thead>
                <tr>
                  <th className="text-[#673AB7]">Student</th>
                  <th className="text-[#673AB7]">Grade</th>
                </tr>
              </thead>
              <tbody>
                {gradesData.getAllGradesByCourseId.map((grade, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-[#673AB7]">
                          {grade.user.firstname} {grade.user.lastname}
                        </div>
                      </div>
                    </td>
                    <td className="text-[#673AB7]">{grade.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Professor;
