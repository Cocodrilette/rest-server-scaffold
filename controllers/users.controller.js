require("dotenv").config();
const { response } = require("express");
const hashPassword = require("../helpers/hashPassword");

const { userModel } = require("../models");

// -----------------------------------------

const createUser = async (req, res = response) => {
  const { name, email, password, role = "USER_ROLE" } = req.body;

  if (
    role == "ADMIN_ROLE" &&
    req.header("x-admin-key") !== process.env.ADMIN_KEY
  ) {
    res.status(401).json({
      Error: "You cannot create Admin User 👀",
    });
  }

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
    newUser,
  });
};

// -----------------------------------------

const getAllUsers = async (req, res = response) => {
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

  try {
  } catch (error) {
    res.sendStatus(404).json({
      Error: "Error getting users",
    });
  }

  res.json({
    usersCount,
    users,
  });
};

// -----------------------------------------

const updateUser = async (req, res = response) => {
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

  const newUserData = await userModel.findByIdAndUpdate(id, userToUpdate, {
    new: true,
  });

  res.json({
    newUserData,
  });
};

// -----------------------------------------

const deleteUser = async (req, res = response) => {
  const { id } = req.params;

  // const uid = req.uid;

  const userAuthenticated = req.userAuthenticated;

  const userToDelete = await userModel.findById(id);

  if (userToDelete.state === false) {
    res.json({
      Error: "This user is already deleted",
    });
    return;
  }

  await userModel.findByIdAndUpdate(id, { state: false });

  res.json({
    userDeleted: userToDelete,
    actionExecutor: userAuthenticated,
  });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
