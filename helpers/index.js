const capitalizeFirstLetter = require("./capitalizeFirstLetter");
const dbValidators = require("./dbValidators");
const generateJWT = require("./generateJWT");
const googleVerify = require("./googleVerify");
const hashPassword = require("./hashPassword");
const uploadFile = require("./uploadFile");
// const getFileName = require("./getFileName");
module.exports = {
  ...capitalizeFirstLetter,
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...hashPassword,
  ...uploadFile,
};
