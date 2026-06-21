const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');

// admin-only: full user roster + edits
router.get('/', ProfileController.getProfile);
router.get('/:id', ProfileController.getProfileById);
router.put('/:id', ProfileController.updateProfile);
router.patch('/:id/status', ProfileController.updateProfileStatus);

module.exports = router;
