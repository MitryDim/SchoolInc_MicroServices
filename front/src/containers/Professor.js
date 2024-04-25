import React,{useEffect,useState} from "react";
import {GET_COURSES_BY_TEACHER_ID} from "../api/graphql/course-queries";
import { useUser } from "../context/userContext";
import { useQuery, gql } from "@apollo/client";

const Professor = () => {
  const [user, setUser] = useState(null);
  const userContext = useUser();


  useEffect(() => {
    if (userContext?.user) {
      setUser(userContext.user);
    }
  }, [userContext?.user]); // Ajoutez userContext.user comme dépendance

  console.log(user)
    const { loading, error, data } = useQuery(GET_COURSES_BY_TEACHER_ID, {
    variables: { teacherId: user?.id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
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
              {data.getCoursesByTeacherId.map(({ id, name, description }) => (
                <tr key={id}>
                  <td className="py-3 px-4 font-montserrat text-center">
                    {name}
                  </td>
                  <td className="py-3 px-4 font-montserrat text-center">
                    {description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Professor;
