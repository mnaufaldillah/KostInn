const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const routerProfile = require('./profiles');
const authentication = require('../middleware/authentication');
const adminOnly = require('../middleware/authorize');
const upload = require('../middleware/upload');

router.post('/register', UserController.register);
router.post('/verify-otp', UserController.verifyOTP);
router.post('/login', UserController.login);
router.post('/request-reset', UserController.requestPasswordReset);
router.post('/reset-password', UserController.resetPassword);

router.use(authentication);

router.get('/me', UserController.me);
router.put('/me', UserController.updateMe);
router.get('/me/history', UserController.myHistory);
router.get('/id-card', UserController.getIDCard);
router.post('/id-card', upload.single('IDCard'), UserController.uploadIDCard);
router.patch('/id-card/:id/validate', UserController.validateIDCard);

router.use('/users', adminOnly, routerProfile);

module.exports = router;