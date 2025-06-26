/**
 * External dependencies
 */
const express = require('express');

/**
 * Internal dependencies
 */
const userController = require('../../controllers/userController');
const authenticateUser = require('../../middleware/auth');

// create the route
const router = express.Router();

// this route is used for login functionality
router.post('/login', userController.login);

// this route is used for signup functionality
router.post('/signup', userController.signup);

// this route is used for update functionality
router.patch('/', authenticateUser, userController.updateUser);

// this route is used for delete functionality
router.delete('/', authenticateUser, userController.deleteUser);

// exports the router
module.exports = router;