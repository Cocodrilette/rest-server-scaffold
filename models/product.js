const { Schema, model } = require("mongoose");

const productSchema = Schema({
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
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
  },
  hasStokc: {
    type: Boolean,
    default: true,
  },
});

productSchema.methods.toJSON = function () {
  const { __v, state, ...productData } = this.toObject();
  return productData;
};

const productModel = model("Product", productSchema);

module.exports = productModel;
