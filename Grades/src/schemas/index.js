const fs = require("fs");
const path = require("path");
const { buildSchema } = require("graphql");
const importGraphQL = (file) => {
  return fs.readFileSync(path.join(__dirname, file), "utf-8");
};
module.exports = {
  userSchema: buildSchema(importGraphQL("./gradeSchema.graphql")),
};
