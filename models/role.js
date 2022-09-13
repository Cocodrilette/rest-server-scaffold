const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
  role: {
    type: String,
    require: [true, "The role is required"],
  },
});

const RoleModel = model("Role", RoleSchema);

module.exports = RoleModel;
