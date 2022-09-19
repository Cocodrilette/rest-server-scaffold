const { Router } = require("express");
const { check } = require("express-validator");

const { loginPOST, googleSignIn } = require("../controllers/login.controller");
const {
  requestFieldValidator,
} = require("../middlewares/requestFieldsValidator");

const router = Router();

// ../controllers/users.controller.js
router.post(
  "/login",
  [
    check("email", "The email is required").not().isEmpty(),
    check("email", "This don't look like an email 👀").isEmail(),
    check("password", "The password is required").not().isEmpty(),
    check("password", "The password have an invalid format").isLength({
      min: 6,
    }),
    // check("email").custom(isEmailExist),
    requestFieldValidator,
  ],
  loginPOST
);

router.post(
  "/google",
  [
    check("id_token", "The token ID is required").not().isEmpty(),
    requestFieldValidator,
  ],
  googleSignIn
);

module.exports = router;
