const { Router } = require("express");
const { check } = require("express-validator");

const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");
//
const {
  isValidRole,
  isEmailExist,
  isUserExistById,
} = require("../helpers/dbValidators");
//
const {
  JWTValidator,
  requestFieldValidator,
  // haveRole,
  isAdminRole,
  haveApiKey,
  haveAdminKey,
} = require("../middlewares");

const router = Router();

// ../controllers/users.controller.js
router.get("/", [haveApiKey], getAllUsers);

// ../controllers/users.controller.js
router.post(
  // path
  "/",
  // middlewares
  [
    haveApiKey,
    check("name", "The name is required").not().isEmpty(), // it's means: can't be empty
    check("password", "The password is required").not().isEmpty(),
    check(
      "password",
      "The password must have more than 6 characters of lenght"
    ).isLength({ min: 6 }),
    check("email", "This don't look like an email 👀").isEmail(),
    check("email").custom(isEmailExist),
    check("role").custom(isValidRole),
    // This is equivalent to the line below. If we recieved only one argument
    // we can pass it trow as the first argument to the funtion without catch it before
    // check("role").custom((role) => isValidRole(role)),

    // check("role", "This is not valid rol").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    requestFieldValidator,
  ],
  // handler
  createUser
);

// ../controllers/users.controller.js
router.put(
  "/:id",
  [
    haveApiKey,
    JWTValidator,
    check("id", "This is not valid ID").isMongoId(),
    check("id").custom(isUserExistById),
    check("role").custom(isValidRole),
    requestFieldValidator,
  ],
  updateUser
);

// ../controllers/users.controller.js
router.delete(
  "/:id",
  [
    JWTValidator,
    haveAdminKey,
    isAdminRole,
    check("id").custom(isUserExistById),
    check("id", "This is not valid ID").isMongoId(),
    requestFieldValidator,
  ],
  deleteUser
);

module.exports = router;
