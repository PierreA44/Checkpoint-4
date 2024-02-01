const express = require("express");

const router = express.Router();

const { read, add, edit, destroy } = require("../controllers/rdvControllers");

router.get("/", read);

router.post("/", add);

router.put("/:id", edit);

router.delete("/:id", destroy);

/* ************************************************************************* */

module.exports = router;
