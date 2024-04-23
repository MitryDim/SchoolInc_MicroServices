const { MongoDataSource } = require("apollo-datasource-mongodb");
const Grade = require('../database/models/grade')

class GradeAPI extends MongoDataSource {
  getGradeByUserId(id) {
    return this.findOne({userId: id});
  }
}

module.exports = GradeAPI;
