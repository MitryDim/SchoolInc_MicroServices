const mongoose = require("mongoose");
const utils = require("../../utils");
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  role: [String],
  speciality: String,
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          v
        );
      },
      message: (props) =>
        `${props.value} is not a valid password. Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`,
    },
  },
  salt: String,
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    
    const salt = await utils.GenerateSalt();
    console.log(this.password, salt);
    const password = await utils.GeneratePassword(this.password, salt);
    this.salt = salt;
    this.password = password;
    next();
  } catch (error) {
    console.error("Error in authSchema.pre save:", error);
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
