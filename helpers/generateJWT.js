require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log("Error on generateJWT", err);
          reject("Can't generate JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = generateJWT;
