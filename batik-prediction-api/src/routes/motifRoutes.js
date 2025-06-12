const Joi = require('@hapi/joi');
const motifController = require('../controllers/motifController');

const motifRoutes = [
  {
    method: 'GET',
    path: '/api/motif',
    options: {
      validate: {
        query: Joi.object({
          provinsi: Joi.string().optional()
        })
      }
    },
    handler: motifController.getAllMotifs
  },
  
  {
    method: 'GET',
    path: '/api/motif/{id}',
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    },
    handler: motifController.getMotifById
  },
  
  {
    method: 'GET',
    path: '/api/motif/search',
    options: {
      validate: {
        query: Joi.object({
          q: Joi.string().min(1).required(),
          limit: Joi.number().integer().min(1).max(50).default(10)
        })
      }
    },
    handler: motifController.searchMotifs
  },
  
  {
    method: 'GET',
    path: '/api/motif/group/provinsi',
    handler: motifController.getMotifsByProvinsi
  },
  
  {
    method: 'GET',
    path: '/api/provinsi',
    handler: motifController.getProvinsiList
  }
];

module.exports = motifRoutes;