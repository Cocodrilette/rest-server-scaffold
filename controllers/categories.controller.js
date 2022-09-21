const { response } = require("express");
const capitalizeFirstLetter = require("../helpers/capitalizeFirstLetter");
const { categoryModel } = require("../models");

// -----------------------------------------

const createCategory = async (req, res = response) => {
  const name = capitalizeFirstLetter(req.body.name);

  // check if the category already exists
  const categoryDB = await categoryModel.findOne({ name });

  if (categoryDB) {
    res.status(400).json({
      Error: `The category ${name} already exists`,
    });
  }

  // generate data to save
  const data = {
    name,
    user: req.userAuthenticated._id,
  };

  const newCatgeory = new categoryModel(data);
  newCatgeory.save();

  res.status(201).send({
    CategoryCreated: newCatgeory,
  });
};

// -----------------------------------------

const getAllCategories = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  if (isNaN(limit) || isNaN(from)) {
    res.status(400).json({
      Error: "You are sending an invalid query. Expected number but get string",
    });
    return;
  }

  const stateQuery = { state: true };
  const [categoriesCount, categories] = await Promise.all([
    categoryModel.countDocuments(),
    categoryModel
      .find(stateQuery)
      .skip(from)
      .limit(limit)
      .populate("user", "name"),
  ]);

  res.status(200).json({
    categoriesCount,
    categories,
  });
};

// -----------------------------------------

const getCategory = async (req, res = response) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id).populate("user", "name");

  res.status(200).json({
    category,
  });
};

// -----------------------------------------

const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const { name } = req.body;

  const categoryDB = await categoryModel.findOne({ name });

  if (categoryDB) {
    res.status(400).json({
      Error: `The category ${name} already exists`,
    });
  }

  const categoryToUpdate = {
    name,
    user: req.userAuthenticated._id,
  };

  const category = await categoryModel.findByIdAndUpdate(id, categoryToUpdate, {
    new: true,
  });

  res.status(200).json({
    categoryUpdated: category,
  });
};

// -----------------------------------------

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  const userAuthenticated = req.userAuthenticated;
  const { name, uid } = userAuthenticated;

  const categoryToDelete = await categoryModel.findById(id);

  if (categoryToDelete.state === false) {
    res.status(400).json({
      Error: "This category is already deleted",
    });
    return;
  }

  await categoryModel.findByIdAndUpdate(id, {
    state: false,
    user: userAuthenticated._id,
  });

  res.status(200).json({
    categoryDeleted: categoryToDelete,
    actionExecutor: {
      name,
      uid,
    },
  });
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
