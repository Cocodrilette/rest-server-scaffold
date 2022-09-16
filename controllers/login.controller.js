const { response } = require("express");
const bcrypt = require("bcrypt");

const userModel = require("../models/user");
const generateJWT = require("../helpers/generateJWT");

const loginPOST = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // checkin if email exist
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({
        Message: "User or Password are incorrect.",
      });
    }

    // checking if user state is true
    if (!user.state) {
      res.status(400).json({
        Message: "User or Password are incorrect.",
      });
    }

    // checking password coincidence
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      res.status(400).json({
        Message: "User or Password are incorrect.",
      });
    }

    // generating JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
    //
  } catch (error) {
    console.log("Error on login controller", error);
    res.status(500).json({
      Error: "Our servers are burning 🔥. Please try again later.",
    });
  }
};

module.exports = {
  loginPOST,
};
