const { Router } = require("express");
const { check } = require("express-validator");

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");
//
const { isProductExistByID } = require("../helpers/dbValidators");
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

// List all categories
router.get("/", [haveApiKey, requestFieldValidator], getAllProducts);

// Get a category by id
router.get(
  "/:id",
  [
    haveApiKey,
    check("id", "This is not valid ID").isMongoId(),
    check("id").custom(isProductExistByID),
    requestFieldValidator,
  ],
  getProduct
);

// Create a new category
router.post(
  "/",
  [
    JWTValidator,
    haveAdminKey,
    check("name", "The name is required").not().isEmpty(),
    // haveRole("ADMIN_ROLE", "USER_ROLE"),
    isAdminRole,
    requestFieldValidator,
  ],
  createProduct
);

// Update a category
// Id exists in the database
router.put(
  "/:id",
  [
    JWTValidator,
    haveAdminKey,
    isAdminRole,
    check("id", "This is not valid ID").isMongoId(),
    check("id").custom(isProductExistByID),
    requestFieldValidator,
  ],
  updateProduct
);

// Delete a category
// Id exists in the database
router.delete(
  "/:id",
  [
    JWTValidator,
    haveAdminKey,
    isAdminRole,
    check("id", "This is not valid ID").isMongoId(),
    check("id").custom(isProductExistByID),
    requestFieldValidator,
  ],
  deleteProduct
);

module.exports = router;
