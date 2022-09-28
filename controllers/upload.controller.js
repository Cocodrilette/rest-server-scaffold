const { response } = require("express");

const { uploadFile } = require("../helpers");
const { userModel, productModel } = require("../models");
const { deleteImage, getAssetInfo } = require("../cloudinary");

const postFile = async (req, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({ Error: "No files were uploaded." });
    return;
  }

  try {
    const file = await uploadFile(req.files, undefined, "tmp");
    return res.json({ file: file.fileName });
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateImage = async (req, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({ Error: "No files were uploaded." });
    return;
  }
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "user":
      model = await userModel.findById(id);
      if (!model) {
        return res.status(400).json({
          Error: `Any users with the ID ${id}`,
        });
      }
      break;
    case "product":
      model = await productModel.findById(id);
      if (!model) {
        return res.status(400).json({
          Error: `Any products with the ID ${id}`,
        });
      }
      break;
    default:
      break;
  }

  try {
    // Clear storage
    if (model.imageId) {
      await deleteImage(model.imageId);
    }

    const file = await uploadFile(req.files, undefined, collection);
    model.image = file.filePath;
    model.imageId = file.fileId;
    await model.save();
    res.json({
      model,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getImage = async (req, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "user":
      model = await userModel.findById(id);
      if (!model) {
        return res.status(400).json({
          Error: `Any users with the ID ${id}`,
        });
      }
      break;
    case "product":
      model = await productModel.findById(id);
      if (!model) {
        return res.status(400).json({
          Error: `Any products with the ID ${id}`,
        });
      }
      break;
    default:
      break;
  }

  // Clear storage
  if (model.imageId) {
    file = await getAssetInfo(model.imageId);
    return res.json({
      url: file.secure_url,
    });
  }
  return res.json({
    notFoundImage:
      "https://res.cloudinary.com/cocloud/image/upload/v1664397118/super-cafe/tmp/no-found_oykuyn.png",
  });
};

module.exports = {
  postFile,
  updateImage,
  getImage,
};
