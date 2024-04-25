const { ApolloServer } = require("@apollo/server");
const { createTestClient } = require("apollo-server-testing");
const { gql } = require("graphql-tag");
const assert = require("assert");
const { gradeSchema } = require("../src/schemas");
const { gradeResolver } = require("../src/resolvers/index");

const server = new ApolloServer({
  schema: gradeSchema,
  resolvers: gradeResolver,
});

const { query, mutate } = createTestClient(server);

describe("Grade Resolvers", () => {
  let gradeId;

  const grade = {
    value: 85,
    courseId: "1",
    userId: "1",
  };

  it("should create a new grade", async () => {
    const CREATE_GRADE = gql`
      mutation CreateGrade($grade: GradeInput) {
        createGrade(grade: $grade) {
          id
          value
          course {
            id
          }
          user {
            id
          }
        }
      }
    `;

    const res = await mutate({
      mutation: CREATE_GRADE,
      variables: {
        grade: grade,
      },
    });

    assert(res.errors === undefined);
    assert(res.data.createGrade.id !== null);
    gradeId = res.data.createGrade.id;
  });

  it("should get a grade by ID", async () => {
    const GET_GRADE_BY_ID = gql`
      query GetGradeById($id: ID!) {
        getGrade(id: $id) {
          id
          value
          course {
            id
          }
          user {
            id
          }
        }
      }
    `;

    const res = await query({
      query: GET_GRADE_BY_ID,
      variables: { id: gradeId },
    });

    assert(res.errors === undefined);
    assert(res.data.getGrade.id === gradeId);
  });

  it("should update a grade", async () => {
    const UPDATE_GRADE = gql`
      mutation UpdateGrade($id: ID!, $grade: GradeInput) {
        updateGrade(id: $id, grade: $grade) {
          id
          value
          course {
            id
          }
          user {
            id
          }
        }
      }
    `;

    const updatedGrade = {
      value: 90,
      courseId: "1",
      userId: "1",
    };

    const res = await mutate({
      mutation: UPDATE_GRADE,
      variables: {
        id: gradeId,
        grade: updatedGrade,
      },
    });

    assert(res.errors === undefined);
    assert(res.data.updateGrade.value === updatedGrade.value);
  });

  it("should delete a grade", async () => {
    const DELETE_GRADE = gql`
      mutation DeleteGrade($id: ID!) {
        deleteGrade(id: $id) {
          id
        }
      }
    `;

    const res = await mutate({
      mutation: DELETE_GRADE,
      variables: { id: gradeId },
    });

    assert(res.errors === undefined);
    assert(res.data.deleteGrade.id === gradeId);
  });
});
