const express = require("express");
const router = express.Router();
const controller = require('../Controller/authcollegeprofile')
const collegeController = require("../Controller/authCollege")

router.get('/:userId', controller.getCollegeById);

router.post("/club-signup", controller.signup);
router.post("/club-verify", controller.verifyOTP);

router.delete("/delete/:userId", controller.deletecollegebyId);
router.delete("/deletecolleges",collegeController.Deletecolleges)

module.exports = router;