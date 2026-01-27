const { Router } = require('express');
const controller = require('../../modules/auth/auth.controller.js');
const { upload } = require('../../middleware/upload/upload.js');
const jwtAuth = require('../../middleware/auth/jwtAuth.js');

const AuthRouter = Router();
AuthRouter
  .post('/signup', controller.authUserSignUp)
  .post('/signin', controller.authUserSignIn)
  .post('/forget-password', controller.authForgetPassword)
  .post('/forget-password/otp-verification', controller.authForgetPasswordVerification)
  .get('/', jwtAuth(['admin', 'user']), controller.getUserById)
  .put('/', upload.any(), jwtAuth(['admin', 'user']), controller.updateUser)
  .get('/user', jwtAuth(['admin']), controller.getAllUser)
  .get('/user/:id', jwtAuth(['admin']), controller.getSingleUser)
  .delete('/user/:id', jwtAuth(['admin']), controller.getDeleteUser);

module.exports = AuthRouter;
