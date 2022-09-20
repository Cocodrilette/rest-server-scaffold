const jwtValidator = require("../middlewares/JWTValidator");
const requestFieldValidator = require("../middlewares/requestFieldsValidator");
const roleValidator = require("../middlewares/rolesValidators");
const apiKeyValidator = require("../middlewares/apiKeyValidator");

module.exports = {
  ...jwtValidator,
  ...requestFieldValidator,
  ...roleValidator,
  ...apiKeyValidator,
};
