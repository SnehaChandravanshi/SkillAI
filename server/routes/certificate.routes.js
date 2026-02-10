const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    generateCertificate,
} = require("../controllers/certificate.controller");

router.post("/generate", auth, generateCertificate);

module.exports = router;
