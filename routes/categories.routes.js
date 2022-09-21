const { Router } = require("express");
const { check } = require("express-validator");

const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");
//
const { isCategoryExistByID } = require("../helpers/dbValidators");
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
router.get("/", [haveApiKey, requestFieldValidator], getAllCategories);

// Get a category by id
router.get(
  "/:id",
  [
    haveApiKey,
    check("id", "This is not valid ID").isMongoId(),
    check("id").custom(isCategoryExistByID),
    requestFieldValidator,
  ],
  getCategory
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
  createCategory
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
    check("id").custom(isCategoryExistByID),
    requestFieldValidator,
  ],
  updateCategory
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
    check("id").custom(isCategoryExistByID),
    requestFieldValidator,
  ],
  deleteCategory
);

module.exports = router;
