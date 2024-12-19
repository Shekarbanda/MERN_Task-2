
const express = require('express');
const { login_controller, signup_controller,history_controller } = require('../Controllers/auth');


const router = express.Router();

router.route('/login').post(login_controller);

router.route('/signup').post(signup_controller);


module.exports = router;