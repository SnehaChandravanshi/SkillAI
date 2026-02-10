// const express = require("express");
// const router = express.Router();

// const auth = require("../middleware/auth.middleware");
// const { createRoadmap } = require("../controllers/roadmap.controller");

// router.post("/generate", auth, createRoadmap);

// module.exports = router;


const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  createRoadmap,
  getMyRoadmap,
} = require("../controllers/roadmap.controller");

router.post("/generate", auth, createRoadmap);
router.get("/my", auth, getMyRoadmap);

module.exports = router;
