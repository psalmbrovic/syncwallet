const express = require('express');
const {
  logoutUser,
  authenticate,
  registerUser,
} = require('../middlewares/AuthMiddleware');

const router = express.Router();

router.get('/login', (request, response) => {
  response.render('login');
});

router.post('/login', authenticate);

router.get('/signup', (request, response) => {
  response.render('signup', {
    next: request.session.next,
  });
});

router.post('/signup', registerUser);

router.get('/password/reset', (request, response) => {
  response.render('forgot-password');
});

router.get('/logout', logoutUser);

const AuthRoute = router;

module.exports = AuthRoute;
