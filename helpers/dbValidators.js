const { categoryModel, productModel } = require("../models");
const RoleModel = require("../models/role");
const userModel = require("../models/user");

const isValidRole = async (role = "") => {
  // Uses custom to allow use callbacks on validation
  const roleExists = await RoleModel.findOne({ role });
  if (!roleExists) {
    throw new Error(`The role: ${role} doesn't exist`);
  }
  return true;
};

const isEmailExist = async (email) => {
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    throw new Error(`This email already exist 👀`);
  }
  return true;
};

const isUserExistById = async (id) => {
  const userExist = await userModel.findById(id);
  if (!userExist) {
    throw new Error("Any user registered with this ID");
  }
  return true;
};

const isCategoryExistByID = async (id) => {
  const categoryExist = await categoryModel.findById(id);
  if (!categoryExist) {
    throw new Error("Any category with this ID");
  }
  return true;
};

const isProductExistByID = async (id) => {
  const productExist = await productModel.findById(id);
  if (!productExist) {
    throw new Error("Any product with this ID");
  }
  return true;
};

const isValidCollection = (collection = "", collections = []) => {
  const isValid = collections.includes(collection);
  if (!isValid) {
    throw new Error("This collection is not valid");
  }
  return true;
};

module.exports = {
  isValidRole,
  isEmailExist,
  isUserExistById,
  isCategoryExistByID,
  isProductExistByID,
  isValidCollection,
};
