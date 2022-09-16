const JWTValidator = require("../middlewares/jwtValidator");
const requestFieldValidator = require("../middlewares/requestFieldsValidator");
const haveRole = require("../middlewares/rolesValidators");

module.exports = {
  JWTValidator,
  ...requestFieldValidator,
  ...haveRole,
};
