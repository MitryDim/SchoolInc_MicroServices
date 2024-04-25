const { ApolloServer } = require("@apollo/server");
const { createTestClient } = require("apollo-server-testing");
const { gql } = require("graphql-tag");
const assert = require("assert");
const { classSchema } = require("../src/schemas");
const { classResolver } = require("../src/resolvers/index");

const server = new ApolloServer({
  schema: classSchema,
  resolvers: classResolver,
});

const { query, mutate } = createTestClient(server);

describe("Class Resolvers", () => {
  let classId;

  const classInput = {
    name: "Mathematics",
    description: "An introduction to algebra",
    coursesId: ["1"],
  };

  it("should create a new class", async () => {
    const CREATE_CLASS = gql`
      mutation CreateClass($class: ClassInput) {
        createClass(class: $class) {
          id
          name
          description
          coursesId
        }
      }
    `;

    const res = await mutate({
      mutation: CREATE_CLASS,
      variables: {
        class: classInput
      },
    });

    assert(res.errors === undefined);
    assert(res.data.createClass.id !== null);
    classId = res.data.createClass.id;
  });

  it("should get a class by ID", async () => {
    const GET_CLASS_BY_ID = gql`
      query GetClassById($id: ID!) {
        getClass(id: $id) {
          id
          name
          description
          coursesId
        }
      }
    `;

    const res = await query({
      query: GET_CLASS_BY_ID,
      variables: { id: classId },
    });

    assert(res.errors === undefined);
    assert(res.data.getClass.id === classId);
  });

  it("should update a class", async () => {
    const UPDATE_CLASS = gql`
      mutation UpdateClass($id: ID!, $class: ClassInput) {
        updateClass(id: $id, class: $class) {
          id
          name
          description
          coursesId
        }
      }
    `;

    const updatedClass = {
      name: "Advanced Mathematics",
      description: "An introduction to calculus",
      coursesId: ["1"],
    };

    const res = await mutate({
      mutation: UPDATE_CLASS,
      variables: {
        id: classId,
        class: updatedClass,
      },
    });

    assert(res.errors === undefined);
    assert(res.data.updateClass.name === updatedClass.name);
  });

  it("should add a course to a class", async () => {
    const ADD_COURSE_TO_CLASS = gql`
      mutation AddCourseToClass($classId: ID!, $courseId: [ID!]) {
        addCourseToClass(classId: $classId, courseId: $courseId) {
          id
          coursesId
        }
      }
    `;

    const res = await mutate({
      mutation: ADD_COURSE_TO_CLASS,
      variables: {
        classId: classId,
        courseId: ["2"],
      },
    });

    assert(res.errors === undefined);
    assert(res.data.addCourseToClass.coursesId.includes("2"));
  });
});