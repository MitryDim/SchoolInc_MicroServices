const { gql } = require("graphql-tag");
const fs = require('fs');
const path = require('path');
const importGraphQL = (file) => {
  return fs.readFileSync(path.join(__dirname, file), "utf-8");
};



module.exports = {
  classeSchema: gql(importGraphQL("./classeSchema.graphql")),
};
