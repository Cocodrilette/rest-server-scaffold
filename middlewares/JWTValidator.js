const { response } = require("express");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user");

const unauthorizedMessage = () => ({
  Message: "You are not authorized to access this route.",
});

const JWTValidator = async (req, res = response, next) => {
  const token = req.header("x-jwt");

  if (!token) {
    return res.status(401).json(unauthorizedMessage());
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    // req.uid = uid;

    const userAuthenticated = await userModel.findById(uid);

    // user exists?
    if (!userAuthenticated) {
      return res.status(401).json(unauthorizedMessage());
    }

    // Is user state active?
    if (!userAuthenticated.state) {
      return res.status(401).json(unauthorizedMessage());
    }

    req.userAuthenticated = userAuthenticated;

    next();
  } catch (error) {
    console.log("Error on JWT Validator", error);
    res.status(401).json(unauthorizedMessage());
  }
};

module.exports = {
  JWTValidator,
};
