export const generateBarChart = (gradesData) => {
  if (!gradesData) return null;

  const studentNames = [];
  const grades = [];

  gradesData.getAllGradesByCourseId.forEach((grade) => {
    studentNames.push(`${grade.user.firstname} ${grade.user.lastname}`);
    grades.push(grade.value);
  });

  return {
    labels: studentNames,
    datasets: [
      {
        label: "Grades",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: grades,
      },
    ],
  };
};
