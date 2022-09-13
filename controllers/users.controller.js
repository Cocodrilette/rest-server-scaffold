const { response } = require("express");
const hashPassword = require("../helpers/hashPassword");

const userModel = require("../models/user");

const usersGET = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  if (isNaN(limit) || isNaN(from)) {
    res.json({
      Error: "You are sending an invalid query. Expected number but get string",
    });
    return;
  }

  const stateQuery = { state: true };
  const [usersCount, users] = await Promise.all([
    userModel.countDocuments(),
    userModel.find(stateQuery).skip(from).limit(limit),
  ]);

  res.json({
    usersCount,
    users,
  });
};

const usersPOST = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const newUser = new userModel({
    name,
    email,
    password: hashPassword(password),
    role,
  });

  // then save
  try {
    await newUser.save();
  } catch (error) {
    console.log("Error", error);
  }

  res.json({
    msg: "POST API Controller",
    newUser,
  });
};

const usersPUT = async (req, res = response) => {
  const { id } = req.params;
  const {
    prevName,
    prevEmail,
    prevPassword,
    prevRole,
    prevState,
    prevGoogle_OAuth,
  } = await userModel.findById(id);
  const { name, email, password, role, state, google_OAuth } = req.body;

  const userToUpdate = {
    name: name ? name : prevName,
    email: email ? email : prevEmail,
    password: password ? hashPassword(password) : prevPassword,
    role: role ? role : prevRole,
    state: state ? state : prevState,
    google_OAuth: google_OAuth ? google_OAuth : prevGoogle_OAuth,
  };

  const newUserData = await userModel.findByIdAndUpdate(id, userToUpdate);

  res.json({
    msg: "PUT controller",
    newUserData,
  });
};

const usersDELETE = async (req, res = response) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(id, { state: false });

  res.json({
    userDeleted: user,
  });
};

module.exports = {
  usersGET,
  usersPOST,
  usersPUT,
  usersDELETE,
};
