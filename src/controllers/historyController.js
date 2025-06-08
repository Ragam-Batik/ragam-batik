const historyService = require('../services/historyService');
const Boom = require('@hapi/boom');

class HistoryController {
  async getHistory(request, h) {
    try {
      const userId = request.auth.user.id;
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 10;
      const provinsi = request.query.provinsi;

      const result = await historyService.getHistory(userId, page, limit, provinsi);

      return h.response({
        status: true,
        message: 'Scan history retrieved successfully',
        ...result
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async getHistoryById(request, h) {
    try {
      const { id } = request.params;
      const userId = request.auth.user.id;

      const history = await historyService.getHistoryById(id, userId);

      return h.response({
        status: true,
        message: 'History retrieved successfully',
        data: history
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async deleteHistory(request, h) {
    try {
      const { id } = request.params;
      const userId = request.auth.user.id;

      const result = await historyService.deleteHistory(id, userId);

      return h.response({
        status: true,
        ...result
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async deleteAllHistory(request, h) {
    try {
      const userId = request.auth.user.id;

      const result = await historyService.deleteAllHistory(userId);

      return h.response({
        status: true,
        ...result
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async getHistoryStats(request, h) {
    try {
      const userId = request.auth.user.id;

      const stats = await historyService.getHistoryStats(userId);

      return h.response({
        status: true,
        message: 'History statistics retrieved successfully',
        data: stats
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async searchHistory(request, h) {
    try {
      const { q: query } = request.query;
      const userId = request.auth.user.id;
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 10;

      if (!query || query.trim().length < 2) {
        throw Boom.badRequest('Search query must be at least 2 characters');
      }

      const result = await historyService.searchHistory(userId, query, page, limit);

      return h.response({
        status: true,
        message: 'History search completed successfully',
        ...result
      }).code(200);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new HistoryController();