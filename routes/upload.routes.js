const { Router } = require("express");
const { check } = require("express-validator");
const {
  postFile,
  updateImage,
  getImage,
} = require("../controllers/upload.controller");
const { isValidCollection, isUserExistById } = require("../helpers");

const { haveApiKey } = require("../middlewares");
const {
  requestFieldValidator,
} = require("../middlewares/requestFieldsValidator");

const router = Router();

router.post("/", [haveApiKey], postFile);

router.put(
  "/:collection/:id",
  [
    haveApiKey,
    check("id", "This is not valid ID").isMongoId(),
    check("collection").custom((c) =>
      isValidCollection(c, ["user", "product"])
    ),
    requestFieldValidator,
  ],
  updateImage
);

router.get(
  "/:collection/:id",
  [
    haveApiKey,
    check("id", "This is not valid ID").isMongoId(),
    check("collection").custom((c) =>
      isValidCollection(c, ["user", "product"])
    ),
    requestFieldValidator,
  ],
  getImage
);

module.exports = router;
