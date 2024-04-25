const { ApolloServer } = require("@apollo/server");
const { createTestClient } = require("apollo-server-testing");
const { gql } = require("graphql-tag");
const assert = require("assert");
const { courseSchema } = require("../src/schemas");
const { courseResolver } = require("../src/resolvers/index");

const server = new ApolloServer({
  schema: courseSchema,
  resolvers: courseResolver,
});

const { query, mutate } = createTestClient(server);

describe("Course Resolvers", () => {
  let courseId;

  const course = {
    name: "Mathematics",
    description: "An introduction to algebra",
    teacherId: ["1"],
  };

  it("should create a new course", async () => {
    const CREATE_COURSE = gql`
      mutation CreateCourse($course: CourseInput) {
        createCourse(course: $course) {
          id
          name
          description
          teacherId
        }
      }
    `;

    const res = await mutate({
      mutation: CREATE_COURSE,
      variables: {
        course: course,
      },
    });

    assert(res.errors === undefined);
    assert(res.data.createCourse.id !== null);
    courseId = res.data.createCourse.id;
  });

  it("should get a course by ID", async () => {
    const GET_COURSE_BY_ID = gql`
      query GetCourseById($id: ID!) {
        getCourse(id: $id) {
          id
          name
          description
          teacherId
        }
      }
    `;

    const res = await query({
      query: GET_COURSE_BY_ID,
      variables: { id: courseId },
    });

    assert(res.errors === undefined);
    assert(res.data.getCourse.id === courseId);
  });

  it("should update a course", async () => {
    const UPDATE_COURSE = gql`
      mutation UpdateCourse($id: ID!, $course: CourseInput) {
        updateCourse(id: $id, course: $course) {
          id
          name
          description
          teacherId
        }
      }
    `;

    const updatedCourse = {
      name: "Advanced Mathematics",
      description: "An introduction to calculus",
      teacherId: ["1"],
    };

    const res = await mutate({
      mutation: UPDATE_COURSE,
      variables: {
        id: courseId,
        course: updatedCourse,
      },
    });

    assert(res.errors === undefined);
    assert(res.data.updateCourse.name === updatedCourse.name);
  });

  it("should delete a course", async () => {
    const DELETE_COURSE = gql`
      mutation DeleteCourse($id: ID!) {
        deleteCourse(id: $id)
      }
    `;

    const res = await mutate({
      mutation: DELETE_COURSE,
      variables: { id: courseId },
    });

    assert(res.errors === undefined);
    assert(res.data.deleteCourse === "Course deleted successfully");
  });
});
