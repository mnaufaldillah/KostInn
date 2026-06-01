const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const routerProfile = require('./profiles');
const authentication = require('../middleware/authentication');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.use(authentication);

router.use('/profiles', routerProfile);

module.exports = router;