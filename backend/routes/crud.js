const express = require("express");
const router = express.Router();
const profileController = require("../Controller/authstudentprofile")

router.get('/:userId', profileController.getUserById);
router.get('/profile/:id', profileController.getUserprofileById);

router.put('/update/:userId', profileController.updateUser);
router.put('/updateProfile/:id', profileController.updateUserProfile);

router.delete('/delete/:userId',profileController.deleteUserbyId);

module.exports = router;