const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth');

const userController = require('../controllers/users');

router.get('/', userController.users_get_all );

router.post('/signup', userController.user_signup);

router.post('/login', userController.user_login);

router.delete('/:userId', checkAuth, userController.user_delete);

module.exports = router;