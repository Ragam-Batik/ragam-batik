const Boom = require('@hapi/boom');
const authService = require('../services/authService');

class AuthController {
  async register(request, h) {
    try {
      const { email, password, fullName } = request.payload;
      
      const result = await authService.register(email, password, fullName);
      
      return h.response({
        status: true,
        message: 'Registration successful',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            full_name: result.user.user_metadata?.full_name
          }
        }
      }).code(201);
    } catch (error) {
      throw error;
    }
  }

  async login(request, h) {
    try {
      const { email, password } = request.payload;
      
      const result = await authService.login(email, password);
      
      return h.response({
        status: true,
        message: 'Login successful',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            full_name: result.user.user_metadata?.full_name
          },
          access_token: result.access_token,
          token_type: 'Bearer'
        }
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async logout(request, h) {
    try {
      const result = await authService.logout(request.auth.token);
      
      return h.response({
        status: true,
        message: result.message
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async getProfile(request, h) {
    try {
      const profile = await authService.getProfile(request.auth.user.id);
      
      return h.response({
        status: true,
        message: 'Profile retrieved successfully',
        data: profile
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(request, h) {
    try {
      const { full_name, avatar_url } = request.payload;
      const updateData = {};
      
      if (full_name) updateData.full_name = full_name;
      if (avatar_url) updateData.avatar_url = avatar_url;
      
      const profile = await authService.updateProfile(request.auth.user.id, updateData);
      
      return h.response({
        status: true,
        message: 'Profile updated successfully',
        data: profile
      }).code(200);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthController();