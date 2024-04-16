import { useState } from "react";

const Classes = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  // Sample data of classes and students
  const classes = [
    {
      id: 1,
      name: "Class 1",
      description: "Description of Class 1",
      students: ["John", "Alice", "Bob"],
    },
    {
      id: 2,
      name: "Class 2",
      description: "Description of Class 2",
      students: ["Emma", "Jack", "Sophia"],
    },
    {
      id: 3,
      name: "Class 3",
      description: "Description of Class 3",
      students: ["Oliver", "Ava", "Noah"],
    },
  ];

  // Function to handle class card click
  const handleClassClick = (classId) => {
    setSelectedClass(classId);
  };

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-3xl font-semibold text-[#673AB7] font-montserrat mt-8">
        Classes
      </h1>
      <div className="grid grid-cols-3 gap-4 mt-5">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className={`bg-white p-4 rounded-lg shadow-md cursor-pointer ${
              selectedClass === classItem.id ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => handleClassClick(classItem.id)}
          >
            <h2 className="text-lg font-semibold">{classItem.name}</h2>
            <p className="text-sm text-gray-600">{classItem.description}</p>
            {selectedClass === classItem.id && (
              <div className="mt-2">
                <h3 className="text-lg font-semibold mb-1">Students:</h3>
                <ul className="list-disc list-inside">
                  {classItem.students.map((student, index) => (
                    <li key={index}>{student}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
