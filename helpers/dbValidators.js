const RoleModel = require("../models/role");
const userModel = require("../models/user");

const isValidRole = async (role = "") => {
  // Uses custom to allow use callbacks on validation
  const roleExists = await RoleModel.findOne({ role });
  if (!roleExists) {
    throw new Error(`The role: ${role} doesn't exist`);
  }
};

const isEmailExist = async (email) => {
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    throw new Error(`This email already exist 👀`);
  }
};

const isUserExistById = async (id) => {
  const userExist = await userModel.findById(id);
  if (!userExist) {
    throw new Error("Any user registered with this ID");
  }
};

module.exports = {
  isValidRole,
  isEmailExist,
  isUserExistById,
};
