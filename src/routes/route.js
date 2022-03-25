const express = require('express');
const router = express.Router();
const internController = require("../controllers/internController")
const userController = require("../controllers/userController")




router.post("/register", userController.createUser)

router.post("/login", userController.login);

//router.get("/functionup/collegeDetails", collegeController.collegeDetails);


module.exports = router;