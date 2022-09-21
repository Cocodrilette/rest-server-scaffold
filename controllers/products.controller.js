const { response } = require("express");
const capitalizeFirstLetter = require("../helpers/capitalizeFirstLetter");
const { productModel, categoryModel } = require("../models");

// -----------------------------------------

const createProduct = async (req, res = response) => {
  const { name, category, description, price } = req.body;
  capitalizeFirstLetter(name);

  const categorydb = await categoryModel.findOne({ category });

  if (!categorydb) {
    res.status(400).json({
      Error: `The category ${category} doesn't exist.`,
    });
  }

  // check if the category already exists
  const product = await productModel.findOne({ name });

  if (product) {
    res.status(400).json({
      Error: `The product ${name} already exists`,
    });
  }

  // generate data to save
  const data = {
    name,
    user: req.userAuthenticated._id,
    category: categorydb._id,
    price,
    description: description ? description : "No description available",
  };

  const newProduct = new productModel(data);
  newProduct.save();

  res.status(201).send({
    productCreated: newProduct,
  });
};

// -----------------------------------------

const getAllProducts = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  if (isNaN(limit) || isNaN(from)) {
    res.status(400).json({
      Error: "You are sending an invalid query. Expected number but get string",
    });
    return;
  }

  const stateQuery = { state: true };
  const [productsCount, products] = await Promise.all([
    productModel.countDocuments(),
    productModel
      .find(stateQuery)
      .skip(from)
      .limit(limit)
      .populate("user", "name")
      .populate("category", "name"),
  ]);

  res.status(200).json({
    productsCount,
    products,
  });
};

// -----------------------------------------

const getProduct = async (req, res = response) => {
  const { id } = req.params;
  const product = await productModel
    .findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.status(200).json({
    product,
  });
};

// -----------------------------------------

const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { name, price, category, description, hasStock } = req.body;

  const productToUpdate = {
    name,
    user: req.userAuthenticated._id,
    price,
    category,
    description,
    hasStock,
  };

  const product = await productModel.findByIdAndUpdate(id, productToUpdate, {
    new: true,
  });

  res.status(200).json({
    productsUpdated: product,
  });
};

// -----------------------------------------

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  const userAuthenticated = req.userAuthenticated;
  const { name, uid } = userAuthenticated;

  const productToDelete = await productModel.findById(id);

  if (productToDelete.state === false) {
    res.status(400).json({
      Error: "This product is already deleted",
    });
    return;
  }

  await productModel.findByIdAndUpdate(id, {
    state: false,
    hasStokc: false,
    user: userAuthenticated._id,
  });

  res.status(200).json({
    productDeleted: productToDelete,
    actionExecutor: {
      name,
      uid,
    },
  });
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
