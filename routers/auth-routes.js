const express = require("express")
const { signup, signin } = require("../controllers/auth-controller")

const router = express.Router()

// router.get
router.post("/signup", signup)
router.post("/signin", signin)
// router.put
// router.delete

module.exports = router