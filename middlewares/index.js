const jwtValidator = require("../middlewares/JWTValidator");
const requestFieldValidator = require("../middlewares/requestFieldsValidator");
const roleValidator = require("../middlewares/rolesValidators");

module.exports = {
  ...jwtValidator,
  ...requestFieldValidator,
  ...roleValidator,
};
