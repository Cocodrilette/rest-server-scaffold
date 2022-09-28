const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { uploadImage } = require("../cloudinary");
const fs = require("node:fs");

const uploadFile = async (
  files,
  validExtensions = ["png", "jpg", "jpeg", "gif"],
  destinationPath = "tmp"
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;

    const parts = file.name.split(".");
    const fileExtension = parts[parts.length - 1];

    if (!validExtensions.includes(fileExtension)) {
      return reject({
        Error: `The file extension [ ${fileExtension} ] is not allowed.`,
      });
    }

    const tempFileName = uuidv4() + "." + fileExtension;

    uploadPath = path.join(
      __dirname,
      "/../uploads/",
      destinationPath,
      tempFileName
    );

    file.mv(uploadPath, async (err) => {
      if (err) {
        return reject(err);
      }

      // Cloudinary
      const { secure_url, public_id } = await uploadImage(
        uploadPath,
        destinationPath
      );

      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }

      const newFile = {
        filePath: secure_url,
        fileId: public_id,
      };

      resolve(newFile);
    });
  });
};

module.exports = { uploadFile };
