import React, { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import { GET_COURSES_BY_TEACHER_ID } from "../api/graphql/course-queries";
import {
  GET_ALL_GRADES_BY_COURSE_ID,
  UPDATE_GRADE,
  DELETE_GRADE,
} from "../api/graphql/grade-queries";
import { useQuery, useMutation } from "@apollo/client";
import Chart from "chart.js/auto";

const computeStats = (grades) => {
  const sortedGrades = grades.map((grade) => grade.value).sort((a, b) => a - b);

  const median =
    sortedGrades.length % 2 === 0
      ? (sortedGrades[sortedGrades.length / 2 - 1] +
          sortedGrades[sortedGrades.length / 2]) /
        2
      : sortedGrades[Math.floor(sortedGrades.length / 2)];

  const lowestGrade = sortedGrades[0];
  const upperGrade = sortedGrades[sortedGrades.length - 1];

  return { median, lowestGrade, upperGrade };
};

const Professor = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [stats, setStats] = useState(null);

  const { user } = useUser();

  const { data, loading, error } = useQuery(GET_COURSES_BY_TEACHER_ID, {
    variables: { teacherId: user.id },
    skip: !user,
  });

  const {
    data: gradesData,
    loading: gradesLoading,
    error: gradesError,
    refetch: refetchGrade,
  } = useQuery(GET_ALL_GRADES_BY_COURSE_ID, {
    variables: { courseId: selectedItem?.id },
    skip: !selectedItem,
  });

  const [editingGrade, setEditingGrade] = useState(null);
  const [gradeValue, setGradeValue] = useState(null);

  const [updateGrade] = useMutation(UPDATE_GRADE);
  const [deleteGrade] = useMutation(DELETE_GRADE);

  const handleEditClick = (grade) => {
    setEditingGrade(grade);
    setGradeValue(grade.value);
  };

  const handleUpdateClick = async () => {
    await updateGrade({
      variables: {
        id: editingGrade.id,
        grade: {
          value: parseInt(gradeValue, 10),
          courseId: editingGrade.course.id,
          userId: editingGrade.user?.id,
        },
      },
    });
    setEditingGrade(null);
  };

  const handleDeleteClick = async (grade) => {
    await deleteGrade({ variables: { id: grade.id } });
    refetchGrade();
  };

  // Check if data is loading or if there's an error
  useEffect(() => {
    if (gradesData) {
      const { median, lowestGrade, upperGrade } = computeStats(
        gradesData.getAllGradesByCourseId
      );
      setStats({ median, lowestGrade, upperGrade });
      updateChart(median, lowestGrade, upperGrade);
    }
  }, [gradesData]);

  const updateChart = (median, lowestGrade, upperGrade) => {
    const ctx = document.getElementById("gradesChart").getContext("2d");

    // Check if a chart instance already exists and destroy it
    if (window.myChart) {
      window.myChart.destroy();
    }

    // Create new chart instance
    window.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Median", "Lowest Grade", "Upper Grade"],
        datasets: [
          {
            label: "Statistics",
            data: [median, lowestGrade, upperGrade],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const courses = data.getCoursesByTeacherId;

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Professor Panel
      </h1>
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
                          {grade.user &&
                            `${grade.user.firstname} ${grade.user.lastname}`}
                        </div>
                      </div>
                    </td>
                    <td className="text-[#673AB7]">
                      {editingGrade === grade ? (
                        <input
                          type="number"
                          value={gradeValue}
                          onChange={(e) => setGradeValue(e.target.value)}
                        />
                      ) : (
                        grade.value
                      )}
                    </td>
                    <td>
                      {editingGrade === grade ? (
                        <button onClick={handleUpdateClick}>Valider</button>
                      ) : (
                        <button onClick={() => handleEditClick(grade)}>
                          Modifier
                        </button>
                      )}
                      <button onClick={() => handleDeleteClick(grade)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <canvas id="gradesChart" width="400" height="200"></canvas>
        </div>
      )}
    </div>
  );
};

export default Professor;
