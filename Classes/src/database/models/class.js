const mongoose = require("mongoose");
const {Schema} = mongoose;
const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  coursesId : [{ type: Schema.ObjectId, required: false }],
});



module.exports = mongoose.model("Class", classSchema);
