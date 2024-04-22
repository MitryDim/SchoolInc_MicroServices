const mongoose = require("mongoose");
const { Schema } = mongoose;
const gradeSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  userId: { type: Schema.ObjectId, required: true },
  courseId: { type: Schema.ObjectId, required: true },
});

module.exports = mongoose.model("Grade", gradeSchema);
