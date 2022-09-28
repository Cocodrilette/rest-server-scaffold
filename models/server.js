require("dotenv").config();
const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");

const dbConnection = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT;
    this.HOST = process.env.HOST;

    // endpints
    this.paths = {
      auth: "/api/auth",
      category: "/api/categories",
      search: "/api/search",
      products: "/api/products",
      upload: "/api/upload",
      user: "/api/users",
    };

    // Middlewares
    this.middlewares();

    // Connection to the DB
    this.connectDB();

    // App routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // Public files
    this.app.use(express.static("public"));

    // CORS
    this.app.use(cors());

    // JSON parse
    this.app.use(express.json());

    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    // getting the routes config from :
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.category, require("../routes/categories.routes"));
    this.app.use(this.paths.search, require("../routes/search.routes"));
    this.app.use(this.paths.products, require("../routes/products.routes"));
    this.app.use(this.paths.upload, require("../routes/upload.routes"));
    this.app.use(this.paths.user, require("../routes/user.routes"));
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log(`\nApp listening on http://${this.HOST}:${this.PORT}/ 🚀`);
    });
  }
}

module.exports = Server;
