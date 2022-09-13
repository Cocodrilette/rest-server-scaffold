const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  state: {
    type: Boolean,
    default: true,
  },
  google_OAuth: {
    type: Boolean,
    default: false,
  },
});

// This is used to remove a certain fields from the returned JSON
// but the Schema and Model still saving all fields
UserSchema.methods.toJSON = function () {
  const { __v, password, ...userData } = this.toObject();
  return userData;
};

const userModel = model("User", UserSchema);

module.exports = userModel;
