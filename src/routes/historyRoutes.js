// File: src/routes/historyRoutes.js
const Joi = require('@hapi/joi');
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middleware/auth');

const historyRoutes = [
  {
    method: 'GET',
    path: '/api/history',
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(50).default(10),
          provinsi: Joi.string().optional()
        })
      }
    },
    handler: historyController.getHistory
  },
  
  {
    method: 'GET',
    path: '/api/history/{id}',
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    },
    handler: historyController.getHistoryById
  },
  
  {
    method: 'DELETE',
    path: '/api/history/{id}',
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    },
    handler: historyController.deleteHistory
  },
  
  {
    method: 'DELETE',
    path: '/api/history',
    options: {
      pre: [{ method: authMiddleware }]
    },
    handler: historyController.deleteAllHistory
  },
  
  {
    method: 'GET',
    path: '/api/history/stats',
    options: {
      pre: [{ method: authMiddleware }]
    },
    handler: historyController.getHistoryStats
  },
  
  {
    method: 'GET',
    path: '/api/history/search',
    options: {
      pre: [{ method: authMiddleware }],
      validate: {
        query: Joi.object({
          q: Joi.string().min(2).required(),
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(50).default(10)
        })
      }
    },
    handler: historyController.searchHistory
  }
];

module.exports = historyRoutes;