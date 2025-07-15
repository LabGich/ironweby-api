const express = require("express")
const { signup } = require("../controllers/auth-controller")

const router = express.Router()

// router.get
router.post("/signup", signup)
// router.put
// router.delete

module.exports = router