const express = require("express");
const cors = require("cors");
require("dotenv").config();

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
      products: "/api/products",
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
  }

  routes() {
    // getting the routes config from :
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.category, require("../routes/categories.routes"));
    this.app.use(this.paths.products, require("../routes/products.routes"));
    this.app.use(this.paths.user, require("../routes/user.routes"));
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log(`\nApp listening on http://${this.HOST}:${this.PORT}/ 🚀`);
    });
  }
}

module.exports = Server;
