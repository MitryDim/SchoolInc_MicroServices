const mongoose = require("mongoose");
const {Schema} = mongoose;
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  classId: { type: Schema.ObjectId, required: false },
  teacherId: [{ type: Schema.ObjectId, required: false }],
});



module.exports = mongoose.model("Course", courseSchema);
