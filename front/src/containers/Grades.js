import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useUser } from "../context/userContext";
import { GET_ALL_GRADES_BY_USER } from "../api/graphql/grade-queries";
import { GET_ALL_COURSES } from "../api/graphql/course-queries";

const Grades = () => {
  const { user } = useUser();
  const [grades, setGrades] = useState([]);
  const [userId, setUserId] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_ALL_GRADES_BY_USER, {
    variables: { userId: userId },
    skip: !userId,
  });

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      refetch();
    }

    if (data && data.getAllGradesByUserId) {
      setGrades(data.getAllGradesByUserId);
    }
  }, [user, data]);

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
            {grades.length > 0 ? (
              grades.map((grade, index) => (
                <tr key={grade.id}>
                  <td className="py-3 px-4 font-montserrat text-center">
                    {grade.course?.name}
                  </td>
                  <td className="py-3 px-4 font-montserrat text-center">
                    {grade.value} / 20
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="py-3 px-4 font-montserrat text-center"
                >
                  No Grades for the moment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;
