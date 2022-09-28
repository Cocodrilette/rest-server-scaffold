const { Router } = require("express");
const { search } = require("../controllers/search.controller");
const { haveApiKey } = require("../middlewares");

const router = Router();

module.exports = router;

router.get("/:collection/:term", [haveApiKey], search);
