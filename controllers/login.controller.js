const { response } = require("express");
const bcrypt = require("bcrypt");

const userModel = require("../models/user");
const generateJWT = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/googleVerify");

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

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, img } = await googleVerify(id_token);

    let user = await userModel.findOne({ email });

    if (!user) {
      // Create user
      const data = {
        name,
        email,
        password: ":P", // the hash function never will match this password
        img,
        google: true,
      };
      user = new userModel(data);
      await user.save();
    }

    // if user state is false
    if (!user.state) {
      res.status(401).json({
        Error: "Get in touch with the administrator. User blocked.",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
    //
  } catch (error) {
    res.status(400).json({
      Error: "Google token is not valid.",
    });
  }
};

module.exports = {
  loginPOST,
  googleSignIn,
};
