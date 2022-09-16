const JWTValidator = require("../middlewares/jwtValidator");
const requestFieldValidator = require("../middlewares/requestFieldsValidator");
const roleValidator = require("../middlewares/rolesValidators");

module.exports = {
  JWTValidator,
  ...requestFieldValidator,
  ...roleValidator,
};
