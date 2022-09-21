const { Schema, model } = require("mongoose");

const categorySchema = Schema({
  name: {
    type: String,
    require: [true, "The name is required"],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
    require: [true, "The state is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: [true, "The user is required"],
  },
});

categorySchema.methods.toJSON = function () {
  const { __v, state, ...categoryData } = this.toObject();
  return categoryData;
};

const categoryModel = model("Category", categorySchema);

module.exports = categoryModel;
