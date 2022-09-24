const { Router } = require("express");
const { search } = require("../controllers/search.controller");

const router = Router();

module.exports = router;

router.get("/:collection/:term", search);
