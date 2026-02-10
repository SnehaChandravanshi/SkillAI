const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    createModule,
    getModule,
} = require("../controllers/module.controller");

router.post("/generate", auth, createModule);
router.get("/:id", auth, getModule);

module.exports = router;
