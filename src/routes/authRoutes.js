// File: src/routes/authRoutes.js
const Joi = require('@hapi/joi');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const authRoutes = [
  {
    method: 'POST',
    path: '/api/auth/register',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required(),
          fullName: Joi.string().min(2).max(100).required()
        })
      }
    },
    handler: authController.register
  },
  
  {
    method: 'POST',
    path: '/api/auth/login',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      }
    },
    handler: authController.login
  },
  
  {
    method: 'POST',
    path: '/api/auth/logout',
    options: {
      pre: [{ method: authMiddleware }]
    },
    handler: authController.logout
  },
  
  {
    method: 'GET',
    path: '/api/auth/profile',
    options: {
      pre: [{ method: authMiddleware }]
    },
    handler: authController.getProfile
  },
  
  {
    method: 'PUT',
    path: '/api/auth/profile',
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        payload: Joi.object({
          full_name: Joi.string().min(2).max(100).optional(),
          avatar_url: Joi.string().uri().optional()
        })
      }
    },
    handler: authController.updateProfile
  }
];

module.exports = authRoutes;