const { response } = require("express");
const { ObjectId } = require("mongodb");
const { userModel, categoryModel, productModel } = require("../models");

const collectionsAllowed = ["category", "products", "users"];

const searchUsers = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const user = await userModel.findById(term);
    return res.status(200).json({
      result: user ? user : [],
    });
  }

  const regex = new RegExp(term, "i");

  const users = await userModel.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  });

  return res.status(200).json({
    result: users,
  });
};

const searchCategories = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const category = await categoryModel.findById(term);
    return res.status(200).json({
      result: category ? category : [],
    });
  }

  const regex = new RegExp(term, "i");

  const categories = await categoryModel.find({
    $and: [{ state: true }, { name: regex }],
  });

  return res.status(200).json({
    result: categories,
  });
};

const searchProducts = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const product = await productModel.findById(term);
    return res.status(200).json({
      result: product ? product : [],
    });
  }

  const regex = new RegExp(term, "i");

  const products = await productModel.find({
    $and: [{ hasStokc: true }, { state: true }, { name: regex }],
  });

  return res.status(200).json({
    result: products,
  });
};

const search = async (req, res = response) => {
  const { collection, term } = req.params;

  if (!collectionsAllowed.includes(collection)) {
    return res.status(400).json({
      Error: "This is not a valid collection",
    });
  }

  switch (collection) {
    case "category":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    case "users":
      searchUsers(term, res);
      break;

    default:
      return res.status(500).json({
        Error: "I forgot add this search 😅",
      });
  }
};

module.exports = {
  search,
};
